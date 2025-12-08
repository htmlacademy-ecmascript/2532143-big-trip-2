import AbstractView from '../framework/view/abstract-view.js';

function createFilterItemTemplate(filter, isChecked) {
  const { type, count } = filter;
  return (
    `<div class="trip-filters__filter">
        <input
         id="filter-${type}"
         class="trip-filters__filter-input  visually-hidden"
         type="radio"
         name="trip-filter"
         ${isChecked ? 'checked' : ''}
         ${count === 0 ? 'disabled' : ''}
         value="${type}"
         >
        <label class="trip-filters__filter-label" for="filter-${type}">${type}</label>
    </div>`
  );
}

function createFilterTemplate(filterItems) {
  const filterItemsTemplate = filterItems
    .map((filter, index) => createFilterItemTemplate(filter, index === 0))
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

  constructor({filters, onFilterChange}) {
    super();
    this.#filters = filters;
    this.#handleFilterChange = onFilterChange;
    this.element.addEventListener('change', this.#changeFilter);
  }

  get template() {
    return createFilterTemplate(this.#filters);
  }

  #changeFilter = (evt) => {
    evt.preventDefault();
    if (evt.target.tagName === 'INPUT') {
      this.#handleFilterChange(evt.target.value);
    }
  };
}
