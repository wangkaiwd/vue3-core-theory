import { createAppAPI } from './apiCreateApp';
import { ShapeFlags } from '@sppk/shared';

let uid = 0;
const createComponentInstance = (vNode) => {
  const instance = {
    uid: uid++,
    vNode,
    type: vNode.type,
    props: {},
    slots: {},
    attrs: {},
    emit: null,
    ctx: {},
    proxy: null,
    setupState: {}, // setup return value
    isMounted: false,
    subTree: {},
    render: null
  };
  instance.ctx = { _: instance };
  return instance;
};
const createSetupContext = (instance) => {
  return {
    emit: instance.emit,
    attrs: instance.attrs,
    slots: instance.slots,
    expose: () => {}
  };
};
const setupStatefulComponent = (instance) => {
  const { setup } = instance.type;
  const { props } = instance;
  if (setup) {
    const setupContext = createSetupContext(instance);
    const result = setup(props, setupContext);
  }
};
const setupComponent = (instance) => {
  const { props, children } = instance.vNode;
  // initProps
  // initSlots
  instance.props = props;
  instance.slots = children;
  setupStatefulComponent(instance);
};
export const createRenderer = (renderOptions) => {
  function mountComponent (n2, container) {
    const instance = n2.component = createComponentInstance(n2);
    setupComponent(instance);
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
  const patch = (n1, n2, container) => {
    const { shapeFlag } = n2;
    if (shapeFlag & ShapeFlags.ELEMENT) { // element

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
