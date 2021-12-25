## vue3-core-theory

### Reactivity

code:

* reactive
* effect
* ref

debug source code of vue3 reactivity module:

* build flow
* try some demo

### Why import vue ?

`Vue cli` will automatically set follow `webpack` configuration:

```js
module.exports = {
  resolve: {
    alias: {
      '@': '/Users/wangkai/workSpace/personalCode/study01/vueJs/kui/src',
      'vue$': 'vue/dist/vue.runtime.esm-bundler.js'
    },
    // ...some 
  }
}
```

in `vue.runtime.esm-bundler.js` import other modules from `@vue/*`:

```javascript
import * as runtimeDom from '@vue/runtime-dom';
import { initCustomFormatter, warn, registerRuntimeCompiler } from '@vue/runtime-dom';

export * from '@vue/runtime-dom';
import { compile } from '@vue/compiler-dom';
import { isString, NOOP, extend, generateCodeFrame } from '@vue/shared';
```

* [webpack resolve alias](https://webpack.js.org/configuration/resolve/#resolvealias)
