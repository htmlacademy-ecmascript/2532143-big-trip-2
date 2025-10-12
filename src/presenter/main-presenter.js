import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/mock-filter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/command-utils.js';
import { SortTypes } from '../consts.js';
import { sortByPrice, sortByTime } from '../utils/point-utils.js';

export default class MainPresenter {
  #mainContainer;
  #pointsModel;
  #headerContainer;
  #controlsContainer;
  #pointListComponent = new PointListView();
  #sortViewComponent = null;
  #infoViewComponent = new InfoView ();
  #pointPresenters = new Map();
  #points = [];
  #offers = [];
  #destinations = [];
  #sorts = SortTypes;
  #currentSortType = SortTypes.DAY.name;
  #sourcedPoints = [];

  constructor({container, pointsModel, headerContainer, controlsContainer}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#controlsContainer = controlsContainer;
  }

  init() {
    this.#points = [...this.#pointsModel.points];
    this.#offers = this.#pointsModel.offers;
    this.#destinations = this.#pointsModel.destinations;
    this.#sourcedPoints = [...this.#pointsModel.points];

    this.#renderFilters();
    this.#renderBoard();
    this.#renderSort();
  }

  #sortPoint(sortType) {
    switch (sortType) {
      case sortType.DAY:
        this.#points = [...this.#sourcedPoints];
        break;
      case sortType.TIME:
        this.#points.sort(sortByTime);
        break;
      case sortType.PRICE:
        this.#points.sort(sortByPrice);
        break;
    }

    this.#currentSortType = sortType;
  }

  #handleSortTypeChange = (sortType) => {
    if (sortType === this.#currentSortType) {
      return;
    }

    this.#sortPoint(this.#sorts);
    this.#clearPointList();
    this.#renderPointList();
  };

  #renderSort() {
    this.#sortViewComponent = new SortView({
      sorts: this.#sorts,
      onSortTypeChange: this.#handleSortTypeChange
    });


    render(this.#sortViewComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#sourcedPoints = updateItem(this.#sourcedPoints, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #renderFilters = () => {
    const filters = generateFilter(this.#points);
    render(new FilterView({ filters }), this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#pointListComponent, this.#mainContainer);

    if (this.#points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointList();
    }

  };

  #renderEmptyList = () => {
    render(new EmptyListView(), this.#mainContainer);
    remove(this.#sortViewComponent);
    remove(this.#infoViewComponent);
  };

  #renderPointList = () => {
    this.#points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.#pointListComponent.element,
        onDataChange: this.#handlePointChange,
        onModeChange: this.#handleModeChange,
      });

      pointPresenter.init(point, this.#offers, this.#destinations);
      this.#pointPresenters.set(point.id, pointPresenter);
    });
  };

  #clearPointList() {
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
