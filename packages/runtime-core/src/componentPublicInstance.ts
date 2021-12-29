import { hasOwn } from '@sppk/shared';

export const publicInstanceProxyHandlers = {
  get (target, key, receiver) {
    const { setupState, props, ctx } = target._;
    if (hasOwn(setupState, key)) {
      return setupState[key];
    } else if (hasOwn(ctx, key)) {
      return ctx[key];
    } else if (hasOwn(props, key)) {
      return props[key];
    }
  },
  set (target, key, value, receiver) {
    const { setupState, props, ctx } = target._;
    if (hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (hasOwn(ctx, key)) {
      ctx[key] = value;
    } else if (hasOwn(props, key)) {
      props[key] = value;
    }
    return true;
  }
};
