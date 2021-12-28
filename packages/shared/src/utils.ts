export const hasChanged = (oldVal, newVal) => {
  return oldVal !== newVal;
};

export const extend = (obj1, obj2) => Object.assign(obj1, obj2);
