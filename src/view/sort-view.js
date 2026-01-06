import AbstractView from '../framework/view/abstract-view.js';

function createSortTemplate(sortItems, currentSort) {
  const sorts = Object.values(sortItems).map((item) => item);
  return (
    `<form class="trip-events__trip-sort  trip-sort" action="#" method="get">
        ${sorts.map((sortItem) => createSortItemTemplate(sortItem, currentSort)).join('')}
          </form>`
  );
}

function createSortItemTemplate(sort, currentSort) {
  return (
    `<div class="trip-sort__item  trip-sort__item--${sort.name}">
      <input
       id="${sort.name}"
       class="trip-sort__input  visually-hidden"
       type="radio" name="trip-sort"
       value="${sort.name}" ${sort.isEnabled === true ? '' : 'disabled'}
       ${sort.name === currentSort ? 'checked' : ''}
       >
        <label class="trip-sort__btn" for="${sort.name}">${sort.name}</label>
    </div>`
  );
}

export default class SortView extends AbstractView{
  #sorts = [];
  #handleSortTypeChange = null;
  #currentSort = null;

  constructor({sorts, onSortTypeChange, currentSort}) {
    super();
    this.#sorts = sorts;
    this.#handleSortTypeChange = onSortTypeChange;
    this.#currentSort = currentSort;

    this.element.addEventListener('change', this.#sortTypeChangeHandler);
  }

  get template() {
    return createSortTemplate(this.#sorts, this.#currentSort);
  }

  #sortTypeChangeHandler = (evt) => {
    this.#handleSortTypeChange(evt.target.value);
  };

}
