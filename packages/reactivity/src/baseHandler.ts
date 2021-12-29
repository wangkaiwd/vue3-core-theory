import { isArray, isObject } from '@sppk/shared';
import { hasChanged } from '@sppk/shared';
import { reactive } from './reactive';
import { activeEffect, track, trigger } from './effect';

const createGetter = (readonly = false, shallow = false) => {
  return (target, prop, receiver) => { // get -> make property map effects
    console.log('get value', target, prop);
    const result = Reflect.get(target, prop, receiver);
    track('get', target, prop);
    if (shallow) {
      return result;
    }
    // need to recursive proxy
    if (isObject(result)) { // proxy only when get value
      return reactive(result);
    }
    return result;
  };
};

// array push method will trigger twice setter:
//  1. add new value
//  2. update array length(this should ignore)
const createSetter = (readonly: boolean, shallow = false) => { // set -> get effects by property and execute all effects
  return (target, prop, val, receiver) => {
    console.log('set value', target, prop, val);
    const key = parseInt(prop);
    const oldValue = target[prop];
    let hasKey = isArray(target) && key ? key < target.length : target.hasOwnProperty(prop);
    const result = Reflect.set(target, prop, val, receiver);
    if (!hasKey) { // add
      trigger('add', target, prop, val);
    } else if (hasChanged(oldValue, val)) { // update length will be filter
      // edit
      trigger('edit', target, prop, val);
    }
    return result;
  };
};

const get = createGetter();
const set = createSetter(false);
const shallowGet = createGetter(false, true);
const shallowSet = createSetter(false, true);

const readonlyGet = createGetter(true, false);
const shallowReadonlyGet = createGetter(true, true);
const readonlySet = (target, key) => {
  console.warn(`${key} property is readonly, can't set it value`);
};

export const reactiveHandler = {
  get,
  set
};
export const shallowReactiveHandler = {
  get: shallowGet,
  set: shallowSet
};

export const readonlyHandler = {
  get: readonlyGet,
  set: readonlySet
};
export const shallowReadonlyHandler = {
  get: shallowReadonlyGet,
  set: readonlySet
};
