import AbstractView from '../framework/view/abstract-view.js';
import { EmptyListMessages } from '../consts.js';

function emptyListMessage () {
  return (
    `<p class="trip-events__msg">${EmptyListMessages.EVERYTHING}</p>`
  );
}

export default class EmptyListView extends AbstractView{
  constructor() {
    super();
  }

  get template() {
    return emptyListMessage ();
  }
}
