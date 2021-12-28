import { createAppAPI } from './apiCreateApp';

export const createRenderer = (renderOptions) => {
  const render = () => {};
  return {
    createApp: createAppAPI(render)
  };
};
