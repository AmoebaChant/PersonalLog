function component() {
  const element = document.createElement('div');
  element.innerText = '<Digging guy />';
  return element;
}

document.body.appendChild(component());
