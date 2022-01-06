// type only
// h('div')

// type + props
// h('div', {})

// type + omit props + children
// Omit props does NOT support named slots
// h('div', []) // array
// h('div', 'foo') // text
// h('div', h('br')) // vnode
// h(Component, () => {}) // default slot
//
// // type + props + children
// h('div', {}, []) // array
// h('div', {}, 'foo') // text
// h('div', {}, h('br')) // vnode
// h(Component, {}, () => {}) // default slot
// h(Component, {}, {}) // named slots
import { isObject, isString } from '@sppk/shared';
import { createVNode, isVNode } from './vNode';

export const h = function (type, propsOrChildren, children) {
  // rest parameters all is children
  // If second arguments not props , it must an array or string text
  const l = arguments.length;
  if (l === 2) { // type + props, type + children, type + text
    if (Array.isArray(propsOrChildren)) { // string
      return createVNode(type, {}, propsOrChildren);
    } else if (isObject(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type, {}, [propsOrChildren]);
      } else {
        return createVNode(type, {}, propsOrChildren);
      }
    } else { // string
      return createVNode(type, {}, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.from(arguments).slice(2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type, propsOrChildren, children);
  }
};
