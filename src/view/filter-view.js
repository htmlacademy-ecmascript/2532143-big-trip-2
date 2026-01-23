import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, currentFilterType) {
  const { type, count } = filter;
  return (
    `<div class="trip-filters__filter">
        <input
         id="filter-${type}"
         class="trip-filters__filter-input  visually-hidden"
         type="radio"
         name="trip-filter"
         ${type === currentFilterType ? 'checked' : ''}
         ${count === 0 ? 'disabled' : ''}
         value="${type}"
         >
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems, currentFilterType) {
  const filterItemsTemplate = filterItems
    .map((filter) => createFilterItemTemplate(filter, currentFilterType))
    .join('');
  return (
    `<div class="trip-controls__filters">
              <h2 class="visually-hidden">Filter events</h2>
              <form class="trip-filters" action="#" method="get">
                ${filterItemsTemplate}
                <button class="visually-hidden" type="submit">Accept filter</button>
              </form>
            </div>`
  );
}

export default class FilterView extends AbstractView {
  #filters = null;
  #handleFilterChange = null;
  #currentFilter = null;

  constructor({filters, onFilterChange, currentFilterType}) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;
    this.#currentFilter = currentFilterType;

    this.element.addEventListener('change', this.#filterChangeHandler);
  }

  get template() {
    return createFilterTemplate(this.#filters, this.#currentFilter);
  }

  #filterChangeHandler = (evt) => {
    evt.preventDefault();
    this.#handleFilterChange(evt.target.value);
  };
}
