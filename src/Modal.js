export class Modal {
  constructor(layout, DOMElem) {
    this.layout = layout;
    this.DOMElem = DOMElem;
  }

  _show() {
    this.DOMElem.classList.remove('hidden');
  };

  _hide() {
    this.DOMElem.classList.add('hidden');
  };

  create() {
    const CONTAINER = document.createElement('DIV');
    CONTAINER.innerHTML = this.layout;
    CONTAINER.classList.add('modal-cover');
    this.DOMElem.appendChild(CONTAINER);
    this._show();
  };
  
  destroy() {
    this.DOMElem.lastChild.remove();
    this._hide();
  }
}