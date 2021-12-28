import { nodeOpts } from './node-opts';
import { patchProp } from './patchProp';
import { extend } from '@sppk/shared';
import { createRenderer } from '@sppk/runtime-core';

const rendererOptions = extend(nodeOpts, { patchProp });

export const createApp = (rootComponent, rootProps) => {
  const app = createRenderer(rendererOptions).createApp(rootComponent, rootProps);
  const { mount } = app;
  app.mount = (containerSelector) => {
    const container = rendererOptions.querySelector(containerSelector);
    // clear content before mount
    container.innerHTML = '';
    // intercept mount method and do your logic
    mount(container);
  };
  return app;
};
