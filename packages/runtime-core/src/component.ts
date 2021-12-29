import { isFunction, isObject } from '@sppk/shared';
import { publicInstanceProxyHandlers } from './componentPublicInstance';

let uid = 0;
export const createComponentInstance = (vNode) => {
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
const finishComponentSetup = (instance) => {
  const Component = instance.type;
  if (!instance.render) {
    instance.render = Component.render;
  }

};
const handleSetupResult = (instance, result) => {
  if (isObject(result)) {
    // return object to render page
    instance.setupState = result;
  } else if (isFunction(result)) {
    // return render function
    instance.render = result;
  }
  finishComponentSetup(instance);
};
const setupStatefulComponent = (instance) => {
  const { setup } = instance.type;
  const { props } = instance;
  if (setup) {
    const setupContext = createSetupContext(instance);
    const result = setup(props, setupContext);
    handleSetupResult(instance, result);
  }
};
export const setupComponent = (instance) => {
  const { props, children } = instance.vNode;
  // initProps
  // initSlots
  instance.props = props;
  instance.slots = children;
  // proxy property to make access value more easy
  instance.proxy = new Proxy(instance.ctx, publicInstanceProxyHandlers);
  setupStatefulComponent(instance);
};
