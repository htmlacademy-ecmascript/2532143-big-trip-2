import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessages } from '../const.js';

function emptyListMessage (filterType, message) {
  const listMessage = message || EmptyListMessages[filterType.toUpperCase()];
  return (
    `<p class="trip-events__msg">${listMessage}</p>`
  );
}

export default class EmptyListView extends AbstractView{
  #filterType = null;
  #message = null;

  constructor({filterType, message = ''}) {
    super();
    this.#filterType = filterType;
    this.#message = message;
  }

  get template() {
    return emptyListMessage (this.#filterType, this.#message);
  }
}
