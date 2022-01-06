import { getCurrentInstance, setCurrentInstance } from './component';

enum LifeCycleHooks {
  BEFORE_MOUNT = 'bm',
  MOUNTED = 'm',
  BEFORE_UPDATE = 'bu',
  UPDATED = 'u'
}

const injectHook = (lifeCycle, hook, target) => {
  if (!target) {
    return;
  }
  const hooks = target[lifeCycle] = target[lifeCycle] || [];
  const wrap = () => {
    setCurrentInstance(target);
    hook();
    setCurrentInstance(null);
  };
  hooks.push(wrap);
  console.log('target', target);
};
const createHook = (lifeCycle) => {
  return (hook, target = getCurrentInstance()) => {
    injectHook(lifeCycle, hook, target);
  };
};
export const executeFns = (fns) => {
  fns.forEach(fn => fn());
};
export const onBeforeMount = createHook(LifeCycleHooks.BEFORE_MOUNT);
export const onMounted = createHook(LifeCycleHooks.MOUNTED);
export const onBeforeUpdate = createHook(LifeCycleHooks.BEFORE_UPDATE);
export const onUpdated = createHook(LifeCycleHooks.UPDATED);
