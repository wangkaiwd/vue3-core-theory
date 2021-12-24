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
  console.log('trigger', targetMap);
  const depsMap = targetMap.get(target);
  if (!depsMap) {
    return;
  }
  const effects = depsMap.get(prop);
  if (!effects) {return;}
  effects.forEach((value) => {
    value();
  });
};


