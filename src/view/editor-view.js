import { POINT_TYPES } from '../const.js';
import { humanizeDate } from '../utils/point-utils.js';
import AbstractStatefulView from '../framework/view/abstract-stateful-view.js';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import { BLANK_POINT } from '../const.js';

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

function createOfferTemplate(offerItem, checkedOffers, isDisabled) {
  const {title, price, id} = offerItem;
  const isChecked = checkedOffers.map((item) => item.id).includes(id) ? 'checked' : '';

  return (
    `<div class="event__offer-selector">
      <input class="event__offer-checkbox  visually-hidden" id="${id}" type="checkbox" name="event-offer-luggage" ${isChecked} ${isDisabled ? 'disabled' : ''}>
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

function renderOffers(offersList, checkedOffers, isDisabled) {
  if (offersList.length === 0) {

    return '';
  }

  return (
    `<section class="event__section  event__section--offers">
        <h3 class="event__section-title  event__section-title--offers">Offers</h3>
        <div class="event__available-offers">
        ${offersList.map((offerItem) => createOfferTemplate(offerItem, checkedOffers, isDisabled)).join('')}
        </div>
      </section>`
  );
}

function createPhotosTemplate(pictures) {
  if (pictures.length === 0) {
    return '';
  }

  return (`
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${pictures.map((picture) => `<img class="event__photo" src="${picture.src}" alt="${picture.description}">`)}
      </div>
    </div>
    `);
}

function createDestinationTemplate(destinations, point) {
  const currentDestination = destinations.find((destinationsItem) => point.destination === destinationsItem.id);
  const { description, pictures } = currentDestination;

  if (!description) {

    return '';
  }

  return (
    `<section class="event__section  event__section--destination">
      <h3 class="event__section-title  event__section-title--destination">Destination</h3>
      <p class="event__destination-description">${description}</p>
        ${createPhotosTemplate(pictures)}
      </section>`
  );
}

function renderButtons(isEditMode, isSaving, isDisabled, isDeleting) {
  const deleteButton = isDeleting ? 'Deleting...' : 'Delete';
  return (
    `<button class="event__save-btn  btn  btn--blue" type="submit" ${isDisabled ? 'disabled' : ''}>${isSaving ? 'Saving...' : 'Save'}</button>
    <button class="event__reset-btn" type="reset" ${isDisabled ? 'disabled' : ''}>${isEditMode ? deleteButton : 'Cancel'}</button>
     ${isEditMode ? '<button class="event__rollup-btn" type="button">' : ''}`
  );
}

function createEditorTemplate(point, destinations, offers, isEditMode) {
  const {type, destination, dateFrom, dateTo, basePrice, isDisabled, isSaving, isDeleting} = point;
  const name = destinations.find((destinationPoint) => destinationPoint.id === destination)?.name || '';
  const offersByType = offers.find((offer) => offer.type === point.type).offers;
  const choosenOffers = offersByType.filter((item) => point.offers.find((id) => item.id === id));

  return (
    `<li class="trip-events__item">
    <form class="event event--edit" action="#" method="post">
      <header class="event__header">
        <div class="event__type-wrapper">
          <label class="event__type  event__type-btn" for="event-type-toggle-1">
            <span class="visually-hidden">Choose event type</span>
            <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
          </label>
          <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox" ${isDisabled ? 'disabled' : ''}>

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
          <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${name}" list="destination-list-1" ${isDisabled ? 'disabled' : ''}>
          <datalist id="destination-list-1">
            ${destinations.map((item) => createOptionTemplate(item)).join('')}
          </datalist>
        </div>

        <div class="event__field-group  event__field-group--time">
          <label class="visually-hidden" for="event-start-time-1">From</label>
          <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${humanizeDate(dateFrom, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
          &mdash;
          <label class="visually-hidden" for="event-end-time-1">To</label>
          <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${humanizeDate(dateTo, 'DD/MM/YY HH:mm')}" ${isDisabled ? 'disabled' : ''}>
        </div>

        <div class="event__field-group  event__field-group--price">
          <label class="event__label" for="event-price-1">
            <span class="visually-hidden">Price</span>
            &euro;
          </label>
          <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" ${isDisabled ? 'disabled' : ''}>
        </div>

        ${renderButtons(isEditMode, isSaving, isDisabled, isDeleting)}
          <span class="visually-hidden">Open event</span>
        </button>
      </header>
      <section class="event__details">
          ${renderOffers(offersByType, choosenOffers, isDisabled)}
          ${destination ? createDestinationTemplate(destinations, point) : ''}
      </section>
    </form>
    </li>`
  );
}

export default class EditorView extends AbstractStatefulView {
  #destinations = null;
  #offers = null;
  #handleEditClick = null;
  #handleFormSubmit = null;
  #datePickerDateFrom = null;
  #datePickerDateTo = null;
  #handleDeletePoint = null;
  #isEditMode = null;
  #isDeletingMode = null;
  #isSavingMode = null;
  #isDisabledMode = null;

  constructor({point = BLANK_POINT, destinations, offers, onEditClick, onFormSubmit, onDeletePoint, isEditMode, isDisabled, isSaving, isDeleting}) {
    super();
    this._setState(EditorView.parsePointToState(point));
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;
    this.#handleFormSubmit = onFormSubmit;
    this.#handleDeletePoint = onDeletePoint;
    this.#isEditMode = isEditMode;
    this.#isDeletingMode = isDeleting;
    this.#isSavingMode = isSaving;
    this.#isDisabledMode = isDisabled;


    this._restoreHandlers();
  }

  get template() {

    return createEditorTemplate(this._state, this.#destinations, this.#offers, this.#isEditMode, this.#isSavingMode, this.#isDeletingMode, this.#isDisabledMode);
  }

  reset(point) {
    this.updateElement(
      EditorView.parsePointToState(point)
    );
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
    this.#datePickerDateTo.set('minDate', userDate);
  };

  #pointDateToCloseHandler = ([userDate]) => {
    this._setState({...this._state.point, dateTo: userDate});
    this.#datePickerDateFrom.set('maxDate', userDate);
  };

  #setDatePickers = () => {
    const [pointDateFromElement, pointDateToElement] = this.element.querySelectorAll('.event__input--time');
    //const currentDate = dayjs().toISOString();
    const commonConfigs = {
      dateFormat: 'd/m/y H:i',
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
        maxDate: this._state.dateTo,
      }
    );

    this.#datePickerDateTo = flatpickr(
      pointDateToElement,
      {
        ...commonConfigs,
        defaultDate: this._state.dateTo,
        onClose: this.#pointDateToCloseHandler,
        minDate: this._state.dateFrom,
      }
    );
  };

  #deletePointHandler = () => {
    this.#handleDeletePoint(EditorView.parseStateToPoint(this._state));
  };

  #editClickHandler = () => {
    this.#handleEditClick();
  };

  #formSubmitHandler = (evt) => {
    evt.preventDefault();
    this.#handleFormSubmit(EditorView.parseStateToPoint(this._state));
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
    this._setState({...this._state.point, basePrice: Number(evt.target.value)});
  };

  _restoreHandlers() {
    this.element.querySelector('.event__rollup-btn')?.addEventListener('click', this.#editClickHandler);
    this.element.querySelector('.event__reset-btn').addEventListener('click', this.#deletePointHandler);
    this.element.addEventListener('submit', this.#formSubmitHandler);
    this.element.querySelector('.event__type-group').addEventListener('change', this.#pointTypeChangeHandler);
    this.element.querySelector('.event__input--destination').addEventListener('change', this.#pointDestinationChangeHandler);
    this.element.querySelector('.event__available-offers')?.addEventListener('change', this.#pointOfferChangeHandler);
    this.element.querySelector('.event__input--price').addEventListener('change', this.#pointPriceChangeHandler);
    this.#setDatePickers();
  }

  static parsePointToState(point) {

    return {...point,
      isDisabled: false,
      isSaving: false,
      isDeleting: false,
    };
  }

  static parseStateToPoint(state) {
    const point = {...state};

    delete point.isDisabled;
    delete point.isSaving;
    delete point.isDeleting;

    return point;
  }
}
