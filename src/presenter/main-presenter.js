import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { BLANK_POINT, DEFAULT_FILTER_TYPE, DEFAULT_SORT_TYPE, FilterTypes, SortTypes, UpdateType, UserAction } from '../const.js';
import { sortByTime, sortByPrice, sortByDay } from '../utils/point-utils.js';
import { filter } from '../utils/filter-util.js';
import NewPointPresenter from './new-point-presenter.js';

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
  #currentSortType = DEFAULT_SORT_TYPE;
  #currentFilterType = DEFAULT_FILTER_TYPE;
  #filterModel = null;
  #emptyListComponent = null;
  #newPointPresenter = null;

  constructor({container, pointsModel, headerContainer, controlsContainer, filterModel, onNewPointDestroy}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#controlsContainer = controlsContainer;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: onNewPointDestroy
    });

    this.#pointsModel.addObserver(this.#handleModelEvent);
    this.#filterModel.addObserver(this.#handleModelEvent);
  }

  get points() {
    this.#currentFilterType = this.#filterModel.filter;
    const points = this.#pointsModel.points;
    const filteredPoints = filter[this.#currentFilterType](points);

    switch (this.#currentSortType) {
      case SortTypes.DAY.name:
        return filteredPoints.toSorted(sortByDay);
      case SortTypes.TIME.name:
        return filteredPoints.toSorted(sortByTime);
      case SortTypes.PRICE.name:
        return filteredPoints.toSorted(sortByPrice);
    }
    return filteredPoints;
  }

  get offers() {
    return this.#pointsModel.offers;
  }

  get destinations() {
    return this.#pointsModel.destinations;
  }

  init() {
    this.#renderBoard();
    this.#renderSort();
  }

  createPoint() {
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init(BLANK_POINT, this.offers, this.destinations);

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
    this.#newPointPresenter.destroy();
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
        this.#clearPointList({resetSortType: true});
        this.#renderBoard();
        break;
      default:
        throw new Error(`Unknown action type: ${actionType}`);
    }
  };


  #handleFilterChange = (name) => {
    if (name !== this.#currentFilterType) {
      this.#currentFilterType = name;
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
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#currentFilterType
    });
    render(this.#emptyListComponent, this.#mainContainer);
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

  #clearPointList({resetSortType = false} = {}) {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
  }
}
