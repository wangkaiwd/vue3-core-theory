import { isObject } from '@sppk/shared';
import { effect, track, trigger } from './effect';

class ComputedRefImpl {
  private _value;
  private dirty = true;
  private effect;

  constructor (getter, public setter) {
    this.effect = effect(getter, {
      lazy: true,
      scheduler: (effect) => {
        console.log('update dependence property');
        this.dirty = true;
        // fixme: this._value will occur some problem
        trigger('edit', this, 'value', this._value);
      }
    });
  }

  get value () {
    if (this.dirty) {
      // collect dependence property effects
      this._value = this.effect();
      track('get', this, 'value');
      this.dirty = false;
    }
    return this._value;
  }

  set value (newValue) {
    this.setter(newValue);
  }
}

export const computed = (getterOrOptions) => {
  if (isObject(getterOrOptions)) {
    const getter = getterOrOptions.get;
    const setter = getterOrOptions.set;
    return new ComputedRefImpl(getter, setter);
  } else {
    const getter = getterOrOptions;
    const setter = () => {
      console.warn('can not set value for computed');
    };
    return new ComputedRefImpl(getter, setter);
  }
};
