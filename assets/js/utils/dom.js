export function qs(selector, parent = document) {
  return parent.querySelector(selector);
}

export function qsa(selector, parent = document) {
  return [...parent.querySelectorAll(selector)];
}

export function createElement(tag, className, content = "") {
  const element = document.createElement(tag);

  if (className) {
    element.className = className;
  }

  if (content) {
    element.textContent = content;
  }

  return element;
}
