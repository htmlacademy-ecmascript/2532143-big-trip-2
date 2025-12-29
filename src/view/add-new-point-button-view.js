import AbstractView from '../framework/view/abstract-view.js';

function createNewAddPointButtonTemplate() {
  return (
    '<button class="trip-main__event-add-btn  btn  btn--big  btn--yellow" type="button">New event</button>'
  );
}

export default class NewAddPointButton extends AbstractView {
  #handleAddButtonClick = null;

  constructor({onAddButtonClick}) {
    super();
    this.#handleAddButtonClick = onAddButtonClick;
    this.element.addEventListener('click', this.#clickHandler);
  }

  get template() {
    return createNewAddPointButtonTemplate();
  }

  #clickHandler = (evt) => {
    evt.preventDefault();
    this.#handleAddButtonClick();
  };
}
