import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(sortItems) {
  const sorts = Object.values(sortItems).map((item) => item);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sorts.map((sortItem) => createSortItemTemplate(sortItem)).join('')}
          </form>`
  );
}

function createSortItemTemplate(sort) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sort.name}">
      <input id="sort-${sort.name}" class="trip-sort__input  visually-hidden" type="radio" name="trip-sort" value="sort-${sort.name}" ${sort.isEnabled === true ? '' : 'disabled'}>
        <label class="trip-sort__btn" for="sort-${sort.name}">${sort.name}</label>
    </div>`
  );
}

export default class SortView extends AbstractView{
  #sorts = [];
  #handleSortTypeChange = null;

  constructor({sorts, onSortTypeChange}) {
    super();
    this.#sorts = sorts;
    this.#handleSortTypeChange = onSortTypeChange;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sorts);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange(evt.target.value);
  };

}
