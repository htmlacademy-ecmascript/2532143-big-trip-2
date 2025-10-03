import { POINT_TYPES } from '../consts.js';
import AbstractView from '../framework/view/abstract-view.js';
import { humanizeDate } from '../utils/point-utils.js';

function createTypeTemplate(type, currentType) {
  const isChecked = type.toLowerCase() === currentType ? 'checked' : '';

  return (
    `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type.to}-1">${type}
        </label>
      </div>`
  );
}

function createOfferTemplate(offerItem, checkedOffers) {
  const {title, price, id} = offerItem;
  const isChecked = checkedOffers.map((item) => item.id).includes(id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="event-offer-luggage-1" type="checkbox" name="event-offer-luggage" ${isChecked}>
      <label class="event__offer-label" for="event-offer-luggage-1">
        <span class="event__offer-title">${title}</span>
        &plus;&euro;&nbsp;
        <span class="event__offer-price">${price}</span>
      </label>
    </div>`
  );
}

function createOptionTemplate(value) {

  return (
    `<option value=${value.name}></option>`
  );
}

function renderOffers(offersList, checkedOffers) {
  if (offersList.length === 0) {

    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersList.map((offerItem) => createOfferTemplate(offerItem, checkedOffers)).join('')}
        </div>
      </section>`
  );
}

function createDestinationTemplate(destinations, point) {
  const destination = destinations[point.id - 1];
  const {description, pictures} = destination;
  if (description > 0 || pictures.length > 0) {

    return (
      `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
    <div class="event__photos-container">
      <div class="event__photos-tape">
        <img class="event__photo" src="${pictures[0].src}" alt="${pictures[0].description}">
      </div>
    </div>
</section>`
    );
  }
}

function createEditorTemplate(point, destinations, offers) {
  const {type, destination, dateFrom, dateTo, basePrice} = point;
  const name = destinations.find((destinationPoint) => destinationPoint.id === destination).name;
  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const choosenOffers = offersByType.filter((item) => point.offers.find((id) => item.id === id));

  return (
    `<form class="event event--edit" action="#" method="post">
                <header class="event__header">
                  <div class="event__type-wrapper">
                    <label class="event__type  event__type-btn" for="event-type-toggle-1">
                      <span class="visually-hidden">Choose event type</span>
                      <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
                    </label>
                    <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

                    <div class="event__type-list">
                      <fieldset class="event__type-group">
                        <legend class="visually-hidden">Event type</legend>
                        ${POINT_TYPES.map((item) => createTypeTemplate(item, point.type)).join('')}

                      </fieldset>
                    </div>
                  </div>

                  <div class="event__field-group  event__field-group--destination">
                    <label class="event__label  event__type-output" for="event-destination-1">
                      ${type}
                    </label>
                    <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1">
                    <datalist id="destination-list-1">
                      ${destinations.map((item) => createOptionTemplate(item)).join('')}
                    </datalist>
                  </div>

                  <div class="event__field-group  event__field-group--time">
                    <label class="visually-hidden" for="event-start-time-1">From</label>
                    <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}">
                    &mdash;
                    <label class="visually-hidden" for="event-end-time-1">To</label>
                    <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}">
                  </div>

                  <div class="event__field-group  event__field-group--price">
                    <label class="event__label" for="event-price-1">
                      <span class="visually-hidden">Price</span>
                      &euro;
                    </label>
                    <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
                  </div>

                  <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
                  <button class="event__reset-btn" type="reset">Delete</button>
                  <button class="event__rollup-btn" type="button">
                    <span class="visually-hidden">Open event</span>
                  </button>
                </header>
                <section class="event__details">
                   ${renderOffers(offersByType, choosenOffers)}
                   ${createDestinationTemplate(destinations, point)}
                </section>
              </form>`
  );
}

export default class EditorView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #handleFormSubmit = null;

  constructor({point, destinations, offers, onEditClick, onFormSubmit}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFormSubmit = onFormSubmit;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
  }

  get template() {
    return createEditorTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit();
  };
}
