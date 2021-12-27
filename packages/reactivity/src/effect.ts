import { isArray, isIntegerKey } from '@sppk/shared';

const effects = [];
export let activeEffect = null;
let id = 0;

const createReactiveEffect = (fn) => {
  const reactiveEffect = () => {
    effects.push(reactiveEffect); // push stack before fn execute
    activeEffect = reactiveEffect;
    const result = fn();
    effects.pop(); // pop stack after fn execute
    activeEffect = effects[effects.length - 1]; // update current active effect function
    return result;
  };
  return reactiveEffect;
};
// prop -> effect
// effect -> prop
export const effect = (fn, options: any = {}) => {
  const innerEffect: any = createReactiveEffect(fn);
  if (!options.lazy) {
    innerEffect();
  }
  innerEffect.id = id++;
  innerEffect.__isEffect = true;
  innerEffect.options = options;
  innerEffect.deps = []; // record collect property
  return innerEffect;
};

const targetMap = new WeakMap();
export const track = (type, target, prop) => {
  if (!activeEffect) {
    return;
  }
  // obj = {}
  // obj = {target:{a:[fn]}}
  // obj.target obj.target = {} obj.target.a = [] a.push(fn)
  let depsMap = targetMap.get(target);
  if (!targetMap.has(target)) {
    depsMap = new Map();
    targetMap.set(target, depsMap);
  }
  let effectSet = depsMap.get(prop);
  if (!effectSet) {
    effectSet = new Set();
    depsMap.set(prop, effectSet);
  }
  effectSet.add(activeEffect);
};

export const trigger = (type, target, prop, value) => {
  console.log('trigger', targetMap, type, target, prop, value);
  const depsMap = targetMap.get(target); // WeakMap{ [1,2,3]{ Map:{ 0:[effect],1:[effect],2:[effect] }}}
  if (!depsMap) {
    return;
  }
  let effects = depsMap.get(prop);
  if (!effects) {return;}
  const add = (effects) => {
    effects.forEach((effect) => {
      if (effect) {
        effects.add(effect);
      }
    });
  };
  if (isArray(target) && prop === 'length') { // value is length's value
    depsMap.forEach((val, key) => {
      // reduce length will make exceed item to undefined
      // may be change length property
      if (key > value || key === 'length') {
        add(val);
      }
    });
  } else {
    add(effects);
    // update length: 1. assign new value 2. update length
    if (isArray(target) && type === 'add' && isIntegerKey(prop)) {
      // collect effect for new value of array
      effects = depsMap.get('length');
      add(effects);
    }
  }
  effects.forEach((value) => {
    const { scheduler } = value.options;
    if (scheduler) {
      scheduler(value);
    } else {
      value();
    }
  });
};


