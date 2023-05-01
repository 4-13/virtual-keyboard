const jsxToDom = (element, props, ...children) => {
  if (typeof element === 'function') {
    return element({ ...props, children });
  }

  const el = document.createElement(element);

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      const eventName = key.match(/^on([A-Z]\w+)$/);
      if (eventName) {
        el.addEventListener(eventName[1].toLowerCase(), value);
      } else {
        el.setAttribute(key, value);
      }
    });
  }

  children.forEach((child) => {
    el.append(child instanceof HTMLElement ? child : document.createTextNode(child));
  });

  return el;
};

export default jsxToDom;
