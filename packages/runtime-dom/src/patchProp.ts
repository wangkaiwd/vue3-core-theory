const patchClass = (element, next) => {
  element.className = next || '';
};

const patchStyle = (element, pre, next) => {
  // delete pre not exist property
  for (const preKey in pre) {
    if (pre.hasOwnProperty(preKey)) {
      if (!(preKey in next)) {
        // reset by setting null or empty string
        element.style[preKey] = '';
      }
    }
  }
  // set new property for style
  for (const nextKey in next) {
    if (next.hasOwnProperty(nextKey)) {
      element.style[nextKey] = next[nextKey];
    }
  }
};

const createInvoker = (fn) => {
  const invoker = (e) => invoker.value(e);
  invoker.value = fn;
  return invoker;
};

const patchListener = (element, key, next) => {
  // next will become new function but bind same listener for element
  // so that can only listen once and easily remove
  const invokers = element._vei || (element._vei = {});
  // avoid replicate listen the same fn
  const eventName = key.toLowerCase().slice(2);
  const invoker = invokers[key];
  if (invoker) { // exist
    if (next) { // update
      invoker.value = next;
    } else { // remove
      element.removeEventListener(eventName, invoker);
      invokers[key] = null;
    }
  } else { // new
    if (next) {
      const invoker = invokers[key] = createInvoker(next);
      element.addEventListener(eventName, invoker);
    }
  }
};
export const patchProp = (el, key, pre, next) => {
  if (key === 'class') {
    patchClass(el, next);
  } else if (key === 'style') {
    patchStyle(el, pre, next);
  } else if (/^on[A-Z]/.test(key)) { // listeners: such as onClick
    patchListener(el, key, next);
  } else {
    el.setAttribute(key, next);
  }
};
