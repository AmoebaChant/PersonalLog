function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = 'Hello from webpack with TypeScript 2';

  return element;
}

document.body.appendChild(component());
