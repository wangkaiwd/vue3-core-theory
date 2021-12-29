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
        console.log('edit');
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
  const mountElement = (vNode, container) => {
    const { type, props, children, shapeFlag } = vNode;
    const el = vNode.el = renderOptions.createElement(vNode.type);
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
    container.appendChild(vNode.el);
    return vNode.el;
  };
  const patchElement = (n1, n2, container) => {

  };

  function processElement (n1, n2, container) {
    if (!n1) {
      mountElement(n2, container);
    } else {
      patchElement(n1, n2, container);
    }
  }

  const patch = (n1, n2, container) => {
    if (n1 && !isSameVNode(n1, n2)) {
      renderOptions.remove(n1.el);
      n1 = null;
      // n1 is null, below code will mount n2 to real dom
    }
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) { // element
      processElement(n1, n2, container);
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
