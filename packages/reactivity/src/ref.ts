import { hasChanged, isObject } from '@sppk/shared';
import { reactive } from './reactive';
import { track, trigger } from './effect';

export const convert = (value) => {
  return isObject(value) ? reactive(value) : value;
};

class RefImpl {
  public _value;
  public _shallow;
  public _rawValue;

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
