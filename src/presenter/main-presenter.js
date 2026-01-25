import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { BLANK_POINT, DEFAULT_FILTER_TYPE, DEFAULT_SORT_TYPE, EmptyListMessages, FilterTypes, SortTypes, UpdateType, UserAction } from '../const.js';
import { sortByTime, sortByPrice, sortByDay } from '../utils/point-utils.js';
import { filter } from '../utils/filter-util.js';
import NewPointPresenter from './new-point-presenter.js';
import LoadingView from '../view/loading-view.js';
import UiBlocker from '../framework/ui-blocker/ui-blocker.js';
import NewAddPointButtonView from '../view/new-add-point-button-view.js';

const TimeLimit = {
  LOWER_LIMIT: 350,
  UPPER_LIMIT: 1000,
};

export default class MainPresenter {
  #mainContainer = null;
  #pointsModel = null;
  #controlsContainer = null;
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
  #newAddPointButtonComponent = null;
  #isCreatingNewPoint = false;
  #loadingComponent = new LoadingView();
  #isLoading = true;
  #uiBlocker = new UiBlocker ({
    lowerLimit: TimeLimit.LOWER_LIMIT,
    upperLimit: TimeLimit.UPPER_LIMIT
  });

  constructor({container, pointsModel, controlsContainer, filterModel}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#controlsContainer = controlsContainer;
    this.#filterModel = filterModel;

    this.#newPointPresenter = new NewPointPresenter({
      pointListContainer: this.#pointListComponent.element,
      onDataChange: this.#handleViewAction,
      onDestroy: this.#handleNewPointFormClose
    });

    this.#newAddPointButtonComponent = new NewAddPointButtonView({
      onAddButtonClick: this.#handleNewAddPointButtonClick,
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
    render(this.#newAddPointButtonComponent, this.#controlsContainer);
    this.#renderBoard();
    this.#renderSort();
  }

  #createPoint = () => {
    this.#isCreatingNewPoint = true;
    this.#currentSortType = DEFAULT_SORT_TYPE;
    this.#filterModel.setFilter(UpdateType.MAJOR, FilterTypes.EVERYTHING);
    this.#newPointPresenter.init(BLANK_POINT, this.offers, this.destinations);
    this.#newAddPointButtonComponent.changeButtonState(true);
  };

  #handleNewPointFormClose = () => {
    this.#isCreatingNewPoint = false;
    this.#newAddPointButtonComponent.changeButtonState(false);
  };

  #handleNewAddPointButtonClick = () => {
    this.#createPoint();
  };

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
        const deletedPoint = this.#pointPresenters.get(update.id);
        if (!deletedPoint) {
          this.#uiBlocker.unblock();
          return;
        }
        deletedPoint.setDeleting();
        try {
          await this.#pointsModel.deletePoint(updateType, update);
        } catch(err) {
          deletedPoint.setAborting();
        }
        break;
    }

    this.#uiBlocker.unblock();
  };

  #handleModelEvent = (updateType, data) => {
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
        this.#newAddPointButtonComponent.changeButtonState(true);
        remove(this.#loadingComponent);
        remove(this.#currentSort);
        this.#renderError();
        break;
    }
  };


  #handleFilterChange = (name) => {
    if (name !== this.#currentFilterType) {
      this.#currentFilterType = name;
    }
  };

  #renderBoard = () => {
    render(this.#pointListComponent, this.#mainContainer);

    if (this.#isLoading) {
      this.#renderLoading();

      return;
    }

    if (this.points.length === 0 && !this.#isCreatingNewPoint) {
      this.#renderEmptyList();
    } else {
      remove(this.#emptyListComponent);
      this.#renderPointList();
    }

  };

  #renderEmptyList = () => {
    this.#emptyListComponent = new EmptyListView({
      filterType: this.#currentFilterType
    });
    render(this.#emptyListComponent, this.#mainContainer);
    remove(this.#currentSort);
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
      message: EmptyListMessages.ERROR
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
