import { isObject } from '@sppk/shared';

export const createReactiveObject = (target) => {
  if (!isObject(target)) {
    return target;
  }
  const handler = {
    get (target, prop, receiver) {
      console.log('get', target, prop, receiver);
      return Reflect.get(target, prop, receiver);
    },
    set (target, prop, val, receiver) {
      return Reflect.set(target, prop, val, receiver);
    }
  };
  return new Proxy(target, handler);
};

export function reactive (target) {
  return createReactiveObject(target);
}

export function shallowReactive () {

}

export function readonly () {

}

export function shallowReadonly () {

}
