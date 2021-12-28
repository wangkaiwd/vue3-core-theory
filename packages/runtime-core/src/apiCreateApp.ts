const createVNode = (type, props, children = null) => {
  const { key } = props;
  const vNode = {
    el: null, // real node
    type,
    props,
    children,
    key,
    __v_isVNode: true
  };
  return vNode;
};
export const createAppAPI = (render) => {
  return (rootComponent, rootProps) => {
    const app = {
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      mount (container) {
        console.log(rootComponent, rootProps, container);
        app._container = container;
        const vNode = createVNode(rootComponent, rootProps);
      }
    };
    return app;
  };
};
