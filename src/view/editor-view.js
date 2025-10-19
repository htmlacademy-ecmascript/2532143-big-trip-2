import { POINT_TYPES } from '../consts.js';
import { humanizeDate } from '../utils/point-utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';

function createTypeTemplate(type, currentType) {
  const isChecked = type.toLowerCase() === currentType ? 'checked' : '';

  return (
    `<div class="event__type-item">
        <input id="event-type-${type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${type}" ${isChecked}>
        <label class="event__type-label  event__type-label--${type.toLowerCase()}" for="event-type-${type}-1">${type}
        </label>
      </div>`
  );
}

function createOfferTemplate(offerItem, checkedOffers) {
  const {title, price, id} = offerItem;
  const isChecked = checkedOffers.map((item) => item.id).includes(id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-luggage" ${isChecked}>
      <label class="event__offer-label" for="${id}">
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
  const name = destinations.find((destinationPoint) => destinationPoint.id === destination)?.name || '';
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

export default class EditorView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #handleFormSubmit = null;
  #datePickerDateFrom = null;
  #datePickerDateTo = null;

  constructor({point, destinations, offers, onEditClick, onFormSubmit}) {
    super();
    this._setState(EditorView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFormSubmit = onFormSubmit;

    this._restoreHandlers();
  }

  get template() {
    return createEditorTemplate(this._state, this.#destinations, this.#offers);
  }

  removeElement = () => {
    super.removeElement();

    if (this.#datePickerDateFrom) {
      this.#datePickerDateFrom.destroy();
      this.#datePickerDateFrom = null;
    }

    if (this.#datePickerDateTo) {
      this.#datePickerDateTo.destroy();
      this.#datePickerDateTo = null;
    }
  };

  #pointDateFromCloseHandler = ([userDate]) => {
    this._setState({...this._state.point, dateFrom: userDate});
    this.#datePickerDateTo.set('minDate', this._state.dateFrom);
  };

  #pointDateToCloseHandler = ([userDate]) => {
    this._setState({...this._state.point, dateTo: userDate});
    this.#datePickerDateFrom.set('maxDate', this._state.dateTo);
  };

  #setDatePickers = () => {
    const [pointDateFromElement, pointDateToElement] = this.element.querySelectorAll('.event__input--time');
    const commonConfigs = {
      dateFormat: 'd/m/Y H:i',
      enableTime: true,
      locale: {firstDayOfWeek: 1},
      'time_24hr': true
    };

    this.#datePickerDateFrom = flatpickr(
      pointDateFromElement,
      {
        ...commonConfigs,
        defaultDate: this._state.dateFrom,
        onClose: this.#pointDateFromCloseHandler,
        maxDate: this._state.dateTo
      }
    );

    this.#datePickerDateTo = flatpickr(
      pointDateToElement,
      {
        ...commonConfigs,
        defaultDate: this._state.dateTo,
        onClose: this.#pointDateToCloseHandler,
        maxDate: this._state.dateFrom
      }
    );
  };

  #editClickHandler = () => {
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(this._state);
  };

  #pointTypeChangeHandler = (evt) => {
    this.updateElement({...this._state.point, type: evt.target.value.toLowerCase(), offers: []});
  };

  #pointDestinationChangeHandler = (evt) => {
    const selectedDestination = this.#destinations.find((pointDestination) => pointDestination.name === evt.target.value);
    const selectedDestinationId = (selectedDestination) ? selectedDestination.id : '';
    this.updateElement({...this._state.point, destination: selectedDestinationId});
  };

  #pointOfferChangeHandler = (evt) => {
    const checkedOffers = Array.from(this.element.querySelectorAll('.event__offer-checkbox:checked'));
    const selectedOffer = evt.target.checked;
    this._setState({...this._state.point, offers: checkedOffers.map((item) => selectedOffer ? item.id : item.id)});
  };

  #pointPriceChangeHandler = (evt) => {
    this._setState({...this._state.point, basePrice: evt.target.value});
  };

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#pointOfferChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
    this.#setDatePickers();
  }

  static parsePointToState(point) {
    return {...point};
  }
}
