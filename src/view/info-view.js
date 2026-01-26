import AbstractView from '../framework/view/abstract-view.js';

function tripInfoTemplate(infoData) {
  if (!infoData) {
    return '';
  }
  const {route, dates, totalCost} = infoData;
  return (
    `<section class="trip-main__trip-info  trip-info">
      <div class="trip-info__main">
        <h1 class="trip-info__title">${route}</h1>

        <p class="trip-info__dates">${dates}</p>
      </div>

      <p class="trip-info__cost">
        Total: &euro;&nbsp;<span class="trip-info__cost-value">${totalCost}</span>
      </p>
    </section>`
  );
}

export default class InfoView extends AbstractView{
  #infoData = null;
  constructor(infoData) {
    super();
    this.#infoData = infoData;
  }

  get template() {
    return tripInfoTemplate(this.#infoData);
  }
}
