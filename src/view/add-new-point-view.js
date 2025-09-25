import AbstractView from '../framework/view/abstract-view.js';

function addNewPointMessage () {
  return (
    '<p class="trip-events__msg">Click New Event to create your first point</p>'
  );
}

export default class AddNewPoint extends AbstractView{
  constructor() {
    super();
  }

  get template() {
    return addNewPointMessage();
  }
}
