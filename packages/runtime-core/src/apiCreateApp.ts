import { createVNode } from './vNode';

export const createAppAPI = (render) => {
  return (rootComponent, rootProps) => {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount (container) {
        app._container = container;
        const vNode = createVNode(rootComponent, rootProps);
        // convert virtual node to real node
        render(vNode, container);
      }
    };
    return app;
  };
};
