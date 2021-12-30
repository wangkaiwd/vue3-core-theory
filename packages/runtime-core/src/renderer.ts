import { createAppAPI } from './apiCreateApp';
import { hasOwn, isString, ShapeFlags } from '@sppk/shared';
import { createComponentInstance, setupComponent } from './component';
import { effect } from '@sppk/reactivity';
import { isSameVNode } from './vNode';

export const createRenderer = (renderOptions) => {
  function setupRenderEffect (instance, container) {
    effect(function componentEffect () {
      if (!instance.isMounted) { // render
        const subTree = instance.subTree = instance.render.call(instance.proxy, instance.proxy);
        patch(null, subTree, container);
        instance.isMounted = true;
      } else { // update
        const prevTree = instance.subTree;
        const nextTree = instance.subTree = instance.render.call(instance.proxy, instance.proxy);
        patch(prevTree, nextTree, container);
      }
    });
  }

  function mountComponent (n2, container) {
    const instance = n2.component = createComponentInstance(n2);
    setupComponent(instance);
    // invoke render method( reactive )
    setupRenderEffect(instance, container);
  }

  function updateComponent (n1, n2, container) {

  }

  const processComponent = (n1, n2, container) => {
    if (!n1) {
      mountComponent(n2, container);
    } else {
      updateComponent(n1, n2, container);
    }
  };
  const mountChildren = (children, container) => {
    children.forEach(child => {
      // recursive patch
      patch(null, child, container);
    });
  };
  const mountElement = (vNode, container, reference) => {
    const { type, props, children, shapeFlag } = vNode;
    const el = vNode.el = renderOptions.createElement(type);
    for (const key in props) {
      if (hasOwn(props, key)) {
        renderOptions.patchProp(el, key, null, props[key]);
      }
    }
    if (shapeFlag & ShapeFlags.ARRAY_CHILDREN) {
      mountChildren(children, el);
    } else if (shapeFlag & ShapeFlags.TEXT_CHILDREN) { // text
      renderOptions.setElementText(el, children);
    }
    renderOptions.insert(container, vNode.el, reference);
    return vNode.el;
  };
  const patchProps = (el, prev, next) => {
    for (const key in prev) {
      if (hasOwn(prev, key) && !(key in next)) { // style, class, listener need to handle separately
        renderOptions.patchProp(el, key, prev[key], null);
      }
    }
    for (const key in next) {
      if (hasOwn(next, key)) {
        renderOptions.patchProp(el, key, prev[key], next[key]);
      }
    }
  };
  const patchKeyedChildren = (el, c1, c2) => {
    let i = 0;
    let endIndex1 = c1.length - 1;
    let endIndex2 = c2.length - 1;
    // 1. sync from start
    while (i <= endIndex1 && i <= endIndex2) {
      const n1 = c1[i], n2 = c2[i];
      if (isSameVNode(n1, n2)) { // run into different node, stop loop
        patch(n1, n2, el);
      } else {
        break;
      }
      i++;
    }
    // 2. sync from end
    while (i <= endIndex1 && i <= endIndex2) {
      const n1 = c1[endIndex1], n2 = c2[endIndex2];
      if (isSameVNode(n1, n2)) {
        patch(n1, n2, el);
      } else {
        break;
      }
      endIndex1--;
      endIndex2--;
    }
    console.log('index', i, endIndex1, endIndex2, c2);
    if (i > endIndex1) { // prepend/append
      if (i <= endIndex2) {
        const nextPos = endIndex2 + 1;
        const reference = nextPos < c2.length ? c2[nextPos].el : null;
        while (i <= endIndex2) {
          // move element
          patch(null, c2[i++], el, reference);
        }
      }
    }
  };
  const patchChildren = (el, n1, n2) => {
    const c1 = n1.children;
    const c2 = n2.children;
    if (!c1 || !c2) { // no c1 and c2
      renderOptions.setElementText(el, '');
    } else if (n2.shapeFlag & ShapeFlags.TEXT_CHILDREN) { // c2 is text
      renderOptions.setElementText(el, c2);
    } else if (n1.shapeFlag & ShapeFlags.TEXT_CHILDREN) { // c1 is text
      // clear previous content
      renderOptions.setElementText(el, '');
      // recursive mount all children
      mountChildren(el, c2);
    } else { //array
      patchKeyedChildren(el, c1, c2);
    }
  };
  const patchElement = (n1, n2, container) => {
    // assign old vNode el to new vNode el, because them is same vNode in current level
    // after will update el's children
    const el = n2.el = n1.el;
    patchProps(el, n1.props, n2.props);
    patchChildren(el, n1, n2);
    // 1. either not children
    // 2. both has children
    //    1. old or new children is text node
    //    2. array compare with array
  };

  function processElement (n1, n2, container, reference) {
    if (!n1) {
      mountElement(n2, container, reference);
    } else {
      patchElement(n1, n2, container);
    }
  }

  // core function
  const patch = (n1, n2, container, reference = null) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNode(n1, n2)) {
      renderOptions.remove(n1.el);
      n1 = null;
      // n1 is null, below code will mount n2 to real dom
    }
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) { // element
      processElement(n1, n2, container, reference);
    } else if (shapeFlag & ShapeFlags.STATEFUL_COMPONENT) { // component
      processComponent(n1, n2, container);
    }
  };
  const render = (vNode, container) => {
    patch(null, vNode, container);
  };
  return {
    createApp: createAppAPI(render)
  };
};
