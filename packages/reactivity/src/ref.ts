import { hasChanged, isArray, isObject } from '@sppk/shared';
import { reactive } from './reactive';
import { track, trigger } from './effect';

export const convert = (value) => {
  return isObject(value) ? reactive(value) : value;
};

class RefImpl {
  public _value;
  public _shallow;
  public _rawValue;
  public __v_isRef = true;

  constructor (rawValue, shallow: boolean) {
    this._rawValue = rawValue;
    this._value = shallow ? rawValue : convert(rawValue);
    this._shallow = shallow;
  }

  get value () {
    track('get', this, 'value');
    return this._value;
  }

  set value (newValue) {
    if (hasChanged(this._rawValue, newValue)) {
      this._rawValue = newValue;
      this._value = this._shallow ? newValue : convert(newValue);
      trigger('edit', this, 'value', newValue);
    }
  }
}

function createRef (value, shallow = false) {
  return new RefImpl(value, shallow);
}

export const ref = (value) => {
  return createRef(value);
};
export const shallowRef = (value) => {
  return createRef(value, true);
};

class ObjectRefImpl {
  constructor (public target, public prop) {}

  // this will trigger reactive proxy get/set trap
  get value () {
    return this.target[this.prop];
  }

  set value (newValue) {
    this.target[this.prop] = newValue;
  }
}

export const toRef = (target, prop) => {
  return new ObjectRefImpl(target, prop);
};

// execute toRef for all target properties and return a new array or object
export const toRefs = (target) => {
  const result = isArray(target) ? [] : {};
  const keys = Object.keys(target);
  keys.forEach(key => {
    result[key] = toRef(target, key);
  });
  return result;
};
