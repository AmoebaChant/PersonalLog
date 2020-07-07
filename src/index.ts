function component() {
  const element = document.createElement('div');

  // Lodash, now imported by this script
  element.innerHTML = 'TypeScript configured';

  return element;
}

document.body.appendChild(component());
