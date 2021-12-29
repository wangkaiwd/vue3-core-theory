import { isObject, isString, ShapeFlags } from '@sppk/shared';

const normalizeChildren = (vNode, children) => {
  if (!children) {
    return;
  }
  let type = 0;

  if (Array.isArray(children)) {
    type = ShapeFlags.ARRAY_CHILDREN;
  } else {
    type = ShapeFlags.TEXT_CHILDREN;
  }
  // vNode.shapeFlag = vNode.shapeFlag | type;
  vNode.shapeFlag |= type;
};
export const createVNode = (type, props, children = null) => {
  const { key } = props;
  const shapeFlag = isString(type) ? ShapeFlags.ELEMENT : isObject(type) ? ShapeFlags.STATEFUL_COMPONENT : 0;
  const vNode = {
    el: null, // real node
    type,
    props,
    children,
    key,
    __v_isVNode: true,
    shapeFlag,
    component: null, // component virtual node component instance
  };
  // set vNode shapeFlag combine with children
  normalizeChildren(vNode, children);
  return vNode;
};
