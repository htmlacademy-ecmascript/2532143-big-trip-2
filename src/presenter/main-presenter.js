import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/mock-filter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
// import { updateItem } from '../utils/command-utils.js';
import { SortTypes } from '../consts.js';
import { sortByPrice, sortByTime } from '../utils/point-utils.js';

export default class MainPresenter {
  #mainContainer;
  #pointsModel;
  #headerContainer;
  #controlsContainer;
  #pointListComponent = new PointListView();
  #currentSort = null;
  #infoViewComponent = new InfoView ();
  #pointPresenters = new Map();
  #sorts = SortTypes;
  #currentSortType = SortTypes.DAY.name;

  constructor({container, pointsModel, headerContainer, controlsContainer}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#controlsContainer = controlsContainer;
  }

  get points() {
    switch (this.#currentSortType) {
      case SortTypes.DAY.name:
        return [...this.#pointsModel.points];
      case SortTypes.TIME.name:
        return [...this.#pointsModel.points].sort(sortByTime);
      case SortTypes.PRICE.name:
        return [...this.#pointsModel.points].sort(sortByPrice);
    }
    return this.#pointsModel.points;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderFilters();
    this.#renderBoard();
    this.#renderSort();
  }

  #handleSortTypeChange = (sortType) => {
    this.#currentSortType = sortType;
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#currentSort = new SortView({
      sorts: this.#sorts,
      onSortTypeChange: this.#handleSortTypeChange
    });


    render(this.#currentSort, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.offers, this.destinations);
  };

  #renderFilters = () => {
    const filters = generateFilter(this.points);
    render(new FilterView({ filters }), this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#pointListComponent, this.#mainContainer);

    if (this.points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointList();
    }

  };

  #renderEmptyList = () => {
    render(new EmptyListView(), this.#mainContainer);
    remove(this.#currentSort);
    remove(this.#infoViewComponent);
  };

  #renderPointList = () => {
    this.points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.#pointListComponent.element,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init(point, this.offers, this.destinations);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
