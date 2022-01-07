export const enum NodeTypes {
  ROOT,
  ELEMENT,
  TEXT,
  COMMENT,
  SIMPLE_EXPRESSION,
  INTERPOLATION,
  ATTRIBUTE,
  DIRECTIVE,
  // containers
  COMPOUND_EXPRESSION,
  IF,
  IF_BRANCH,
  FOR,
  TEXT_CALL,
  // codegen
  VNODE_CALL,
  JS_CALL_EXPRESSION,
  JS_OBJECT_EXPRESSION,
  JS_PROPERTY,
  JS_ARRAY_EXPRESSION,
  JS_FUNCTION_EXPRESSION,
  JS_CONDITIONAL_EXPRESSION,
  JS_CACHE_EXPRESSION,

  // ssr codegen
  JS_BLOCK_STATEMENT,
  JS_TEMPLATE_LITERAL,
  JS_IF_STATEMENT,
  JS_ASSIGNMENT_EXPRESSION,
  JS_SEQUENCE_EXPRESSION,
  JS_RETURN_STATEMENT
}

// ?: 0 or 1
// (): group
// [^a-b]: not (a or b)
// \s: white space
// \t: tab
// \r: carriage return
// \n: new line
// * : 0 or more
// + : 1 or more
const tagReg = /^<\/?([a-z][^\s\t\r\n\/>]*)/;
const spaceReg = /[\s\r\n\t]+>/;
const parseTag = (context) => {
  const start = getCursor(context);
  const match = tagReg.exec(context.source);
  const tag = match[1];
  // delete < and tag name
  advanceBy(context, match[0].length);
  // delete whitespace
  advanceSpace(context);
  const isSelfClosing = context.source.startsWith('/>');
  advanceBy(context, isSelfClosing ? 2 : 1);
  return {
    type: NodeTypes.ELEMENT,
    tag,
    isSelfClosing,
    loc: getSelection(context, start)
  };
};
const parseElement = (context) => {
  const ele: any = parseTag(context);
  ele.children = parseChildren(context);
  if (context.source.startsWith('</')) { // close tag
    parseTag(context);
  }
  ele.loc = getSelection(context, ele.loc.start);
  return ele;
};
const parseInterpolation = (context) => {
  const start = getCursor(context);
  const endIndex = calcExpEndIndex(context);
  // delete {{
  advanceBy(context, 2);
  const innerStart = getCursor(context);
  const innerEnd = getCursor(context);
  const rawContentLength = endIndex - 4;
  // delete content from template
  // template: }}
  const preTrimContent = parseTextData(context, rawContentLength);
  const content = preTrimContent.trim();
  const startOffset = preTrimContent.indexOf(content);
  // accumulate line,column,offset by reference
  advancePositionWithMutation(innerStart, startOffset, preTrimContent);
  advancePositionWithMutation(innerEnd, content.length + startOffset, preTrimContent);
  // delete end }}
  advanceBy(context, 2);
  return {
    loc: getSelection(context, start),
    content: {
      content,
      type: NodeTypes.SIMPLE_EXPRESSION,
      isStatic: false,
      loc: getSelection(context, innerStart, innerEnd)
    },
    type: NodeTypes.INTERPOLATION
  };
};
const createParserContext = (source) => {
  return {
    source,
    line: 1,
    column: 1,
    offset: 0,
    originalSource: source
  };
};
const calcTextEndIndex = (context) => {
  const { source } = context;
  const endToken = ['<', '{{'];
  const len = source.length;
  let endIndex = 0;
  // employ binary search optimize evaluate ?
  // get smallest index
  for (let i = 0; i < len; i++) {
    if (endToken.includes(source[i])) {
      endIndex = i;
      break;
    }
  }
  return endIndex;
};
const calcExpEndIndex = (context) => {
  const { source } = context;
  return source.indexOf('}}') + 2;
};
const getCursor = (context) => {
  const { line, column, offset } = context;
  return {
    line,
    column,
    offset
  };
};
const advanceSpace = (context) => {
  // match [0]: full string of characters matched
  const match = spaceReg.exec(context.source);
  if (match) {
    advanceBy(context, match[0].length);
  }
};
const advanceBy = (context, endIndex) => {
  const { source } = context;
  // get end cursor position before delete parsed part
  advancePositionWithMutation(context, endIndex);
  context.source = source.slice(endIndex);
};
const getSelection = (context, start, end?) => {
  end = end || getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  };
};
const advancePositionWithMutation = (context, endIndex, source = context.source,) => {
  let line = 0;
  let lastLineStartIndex = 0;
  for (let i = 0; i < endIndex; i++) {
    if (source[i] === '\n') {
      line++;
      lastLineStartIndex = i + 1;
    }
  }
  context.line += line;
  context.column += endIndex - lastLineStartIndex;
  context.offset += endIndex;
};
const ensureOneSpace = (str) => {
  return str.replace(/\s+/g, ' ');
};
const parseTextData = (context, endIndex) => {
  const { source } = context;
  const content = source.slice(0, endIndex);
  // delete parsed template after assign content, continue parse rest template
  advanceBy(context, endIndex);
  return ensureOneSpace(content);
};
const parseText = (context) => {
  let endIndex = calcTextEndIndex(context);
  const start = getCursor(context);
  const content = parseTextData(context, endIndex);
  return content.trim() && {
    loc: getSelection(context, start),
    content,
    type: NodeTypes.TEXT
  };
};

const isEnd = (context) => {
  // empty and end tag will stop parse work
  return !context.source.trim() || context.source.startsWith('</');
};

function parseChildren (context) {
  const nodes = [];
  while (!isEnd(context)) {
    const source = context.source;
    let node;
    if (source[0] === '<') { // tag
      node = parseElement(context);
    } else if (source.startsWith('{{')) { // expression
      node = parseInterpolation(context);
    } else { // text
      node = parseText(context);
    }
    node && nodes.push(node);
  }

  return nodes;
}

const createRoot = (context, children) => {
  const endIndex = context.source.length;
  const start = { line: 1, column: 1, offset: 0 };
  advanceBy(context, context.source.length);
  return {
    type: NodeTypes.ROOT,
    loc: getSelection(context, start),
    children
  };
};
const baseParse = (template) => {
  const context = createParserContext(template);
  return createRoot(context, parseChildren(context));
};
export const baseCompile = (template) => {
  const ast = baseParse(template);
  return ast;
};
