const parseTag = () => {

};
const parseInterpolate = () => {

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
const calculateEndIndex = (context) => {
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
const getCursor = (context) => {
  const { line, column, offset } = context;
  return {
    line,
    column,
    offset
  };
};
const advanceBy = (context, endIndex) => {
  const { source } = context;
  // get end cursor position before delete parsed part
  advancePositionWithMutation(context, endIndex);
  context.source = source.slice(endIndex);
};
const getSelection = (context, start) => {
  const end = getCursor(context);
  return {
    start,
    end,
    source: context.originalSource.slice(start.offset, end.offset)
  };
};
const advancePositionWithMutation = (context, endIndex) => {
  const { source } = context;
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

const parseTextData = (context, endIndex) => {
  const { source } = context;
  const content = source.slice(0, endIndex);
  // delete parsed template after assign content, continue parse rest template
  advanceBy(context, endIndex);
  return content;
};
const parseText = (context) => {
  let endIndex = calculateEndIndex(context);
  const start = getCursor(context);
  const content = parseTextData(context, endIndex);
  return {
    loc: getSelection(context, start),
    content
  };
};

const isEnd = (context) => {
  return !context.source;
};

function parseChildren (context) {
  const nodes = [];
  while (!isEnd(context)) {
    const source = context.source;
    let node;
    if (source[0] === '<') { // tag

    } else if (source.startsWith('{{')) { // expression

    } else { // text
      node = parseText(context);
    }
    nodes.push(node);
    break;
  }

  return nodes;
}

const baseParse = (template) => {
  const context = createParserContext(template);
  return parseChildren(context);
};
export const baseCompile = (template) => {
  const ast = baseParse(template);
  return ast;
};
