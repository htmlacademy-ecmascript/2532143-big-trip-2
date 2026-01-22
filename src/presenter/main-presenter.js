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
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import { newAddPointButtonComponent } from '../main.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

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
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker ({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

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
    remove(this.#emptyListComponent);
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
      currentSort: this.#currentSortType,
      onSortTypeChange: this.#handleSortTypeChange
    });


    render(this.#currentSort, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #handleModeChange = () => {
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handleViewAction = async (actionType, updateType, update) => {
    this.#uiBlocker.block();

    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this.#pointPresenters.get(update.id).setSaving();
        try {
          await this.#pointsModel.updatePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
      case UserAction.ADD_POINT:
        this.#newPointPresenter.setSaving();
        try {
          await this.#pointsModel.addPoint(updateType, update);
        } catch(err) {
          this.#newPointPresenter.setAborting();
        }
        break;
      case UserAction.DELETE_POINT:
        this.#pointPresenters.get(update.id).setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          this.#pointPresenters.get(update.id).setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
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
        remove(this.#currentSort);
        this.#renderSort();
        this.#renderBoard();
        break;
      case UpdateType.INIT:
        this.#isLoading = false;
        remove(this.#loadingComponent);
        this.#renderBoard();
        break;
      case UpdateType.INIT_ERROR:
        this.#isLoading = false;
        newAddPointButtonComponent.element.disabled = true;
        remove(this.#loadingComponent);
        remove(this.#currentSort);
        this.#renderError();
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
    if (this.#isLoading) {
      this.#renderLoading();

      return;
    }

    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#pointListComponent, this.#mainContainer);

    if (this.points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderPointList();
      remove(this.#emptyListComponent);
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

  #renderLoading() {
    render(this.#loadingComponent, this.#mainContainer, RenderPosition.AFTERBEGIN);
  }

  #renderError() {
    this.#emptyListComponent = new EmptyListView({
      message: 'Failed to load latest route information'
    });
    render(this.#emptyListComponent, this.#mainContainer);
  }

  #clearPointList({resetSortType = false} = {}) {
    if (resetSortType) {
      this.#currentSortType = DEFAULT_SORT_TYPE;
    }
    this.#newPointPresenter.destroy();
    this.#pointPresenters.forEach((presenter) => presenter.destroy());
    this.#pointPresenters.clear();
  }
}
