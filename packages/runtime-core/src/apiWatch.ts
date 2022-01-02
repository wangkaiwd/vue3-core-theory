import { effect } from '@sppk/reactivity';
import { hasChanged } from '@sppk/shared';

const doWatch = (source, cb, options) => {
  let oldValue = undefined;
  const scheduler = () => {
    if (!cb) {return cb();}
    const newValue = runner();
    if (hasChanged(oldValue, newValue)) {
      cb(newValue, oldValue);
      oldValue = newValue;
    }
  };
  const runner = effect(source, {
    lazy: true,
    scheduler
  });
  if (options.immediately) {
    scheduler();
  }
  oldValue = runner();
};
export const watch = (getter, cb, options) => {
  return doWatch(getter, cb, options);
};

export const watchEffect = (source) => {
  return doWatch(source, undefined, {});
};
