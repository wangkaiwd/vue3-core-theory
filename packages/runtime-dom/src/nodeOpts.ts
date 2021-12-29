// https://stackoverflow.com/a/9979779/12819402
export const nodeOpts = {
  // create
  create (tag) {
    return document.createElement(tag);
  },
  // delete
  remove (element) {
    return element.remove();
  },
  // edit

  // find
  querySelector (selector) {
    return document.querySelector(selector);
  },
  insert (parent, newNode, referenceNode) {
    return parent.insertBefore(newNode, referenceNode);
  },
  createTextNode (text) {
    return document.createTextNode(text);
  },
  setText (textNode, newText) {
    return textNode.textContent = newText;
  },
  getParent (element) {
    return element.parentNode;
  },
  nextSibling (element) {
    return element.nextElementSibling;
  }
};

// create

