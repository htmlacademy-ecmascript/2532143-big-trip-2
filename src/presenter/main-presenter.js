import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/mock-filter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';
import { updateItem } from '../utils/command-utils.js';

export default class MainPresenter {
  #mainContainer;
  #pointsModel;
  #headerContainer;
  #controlsContainer;
  #pointListComponent = new PointListView();
  #sortViewComponent = new SortView();
  #infoViewComponent = new InfoView ();
  #pointPresenters = new Map();
  #points = [];
  #offers = [];
  #destinations = [];

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

    this.#renderFilters();
    this.#renderBoard();
  }

  #handleModeChange = () => {
    this.#pointPresenters.forEach((presenter) => presenter.resetView());
  };

  #handlePointChange = (updatedPoint) => {
    this.#points = updateItem(this.#points, updatedPoint);
    this.#pointPresenters.get(updatedPoint.id).init(updatedPoint, this.#offers, this.#destinations);
  };

  #renderFilters = () => {
    const filters = generateFilter(this.#points);
    render(new FilterView({ filters }), this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#sortViewComponent, this.#mainContainer);
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
