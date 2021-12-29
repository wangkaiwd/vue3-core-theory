// https://stackoverflow.com/a/9979779/12819402
export const nodeOpts = {
  // create
  createElement (tag) {
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
  setElementText (element, newText) {
    return element.textContent = newText;
  },
  parentNode (element) {
    return element.parentNode;
  },
  nextSibling (element) {
    return element.nextElementSibling;
  }
};

// create

