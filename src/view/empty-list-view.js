import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessages } from '../const.js';

function emptyListMessage (filterType) {
  const listMessage = EmptyListMessages[filterType.toUpperCase()];
  return (
    `<p class="trip-events__msg">${listMessage}</p>`
  );
}

export default class EmptyListView extends AbstractView{
  #filterType = null;

  constructor({filterType}) {
    super();
    this.#filterType = filterType;
  }

  get template() {
    return emptyListMessage (this.#filterType);
  }
}
