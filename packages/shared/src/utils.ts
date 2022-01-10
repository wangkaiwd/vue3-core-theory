export const hasChanged = (oldVal, newVal) => {
  return oldVal !== newVal;
};

export const extend = (obj1, obj2) => Object.assign(obj1, obj2);

export const hasOwn = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
export const isEmpty = (value) => !value && value !== 0;
