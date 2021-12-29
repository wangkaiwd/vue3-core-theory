export const isObject = (value) => {
  return value !== null && typeof value === 'object';
};
export const isArray = Array.isArray;

export const isIntegerKey = (value) => {
  return Number(value) + '' === value;
};

export const isString = (value) => typeof value === 'string';

export const isFunction = (value) => typeof value === 'function';
