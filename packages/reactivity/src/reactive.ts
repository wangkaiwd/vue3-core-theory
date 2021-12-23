import { isObject } from '@sppk/shared';

export const createReactiveObject = (target) => {
  if (!isObject(target)) {
    return target;
  }
  return new Proxy(target, {});
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
