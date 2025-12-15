import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/mock-filter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { FilterTypes, SortTypes, UpdateType, UserAction } from '../const.js';
import { sortByTime, sortByPrice, sortByDay } from '../utils/point-utils.js';

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
  #currentFilterType = FilterTypes.EVERYTHING;

  constructor({container, pointsModel, headerContainer, controlsContainer}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#controlsContainer = controlsContainer;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    switch (this.#currentSortType) {
      case SortTypes.DAY.name:
        return this.#pointsModel.points.toSorted(sortByDay);
      case SortTypes.TIME.name:
        return this.#pointsModel.points.toSorted(sortByTime);
      case SortTypes.PRICE.name:
        return this.#pointsModel.points.toSorted(sortByPrice);
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
    this.#handleModelEvent(UpdateType.MINOR);
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

  #handleViewAction = (actionType, updateType, update) => {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointsModel.updatePoint(updateType, update);
        break;
      case UserAction.ADD_POINT:
        this.#pointsModel.addPoint(updateType, update);
        break;
      case UserAction.DELETE_POINT:
        this.#pointsModel.deletePoint(updateType, update);
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };

  #handleModelEvent = (updateType, data, actionType) => {
    switch (updateType) {
      case UpdateType.PATCH:
        this.#pointPresenters.get(data.id).init(data, this.offers, this.destinations);
        break;
      case UpdateType.MINOR:
        this.#clearPointList();
        this.#renderBoard();
        break;
      case UpdateType.MAJOR:
        // - обновить всю доску (например, при переключении фильтра)
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };

  #renderFilters = () => {
    const filters = generateFilter(this.points);
    render(new FilterView({ filters, onFilterChange: this.#handleFilterChange}), this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #handleFilterChange = (name) => {
    if (name !== this.#currentFilterType) {
      this.#clearPointList();
      this.#currentFilterType = name;
      this.#renderPointList();
    }
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
        onDataChange: this.#handleViewAction,
        onModeChange: this.#handleModeChange,
        onSortTypeChange: this.#handleSortTypeChange,
        onFilterChange: this.#handleFilterChange
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
