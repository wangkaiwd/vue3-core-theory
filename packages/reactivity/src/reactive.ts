import { isObject } from '@sppk/shared';
import { reactiveHandler } from './base-handler';

const reactiveMap = new WeakMap();

// const readonlyMap = new WeakMap();

export const createReactiveObject = (target, baseHandler) => {
  if (!isObject(target)) {
    return target;
  }
  // cache all reactive target
  if (reactiveMap.has(target)) {
    return reactiveMap.get(target);
  }
  const proxy = new Proxy(target, baseHandler);
  reactiveMap.set(target, proxy);
  return proxy;
};

export function reactive (target) {
  return createReactiveObject(target, reactiveHandler);
}

export function shallowReactive () {

}

export function readonly () {

}

export function shallowReadonly () {

}
