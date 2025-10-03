import PointListView from '/src/view/point-list-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/trip-filter.js';
import { remove, render, RenderPosition } from '../framework/render.js';
import PointPresenter from './point-presenter.js';

export default class MainPresenter {
  #mainContainer;
  #pointsModel;
  #headerContainer;
  #controlsContainer;
  #pointListComponent = new PointListView();
  #sortViewComponent = new SortView();
  #infoViewComponent = new InfoView ();

  constructor({container, pointsModel, headerContainer, controlsContainer}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
    this.#headerContainer = headerContainer;
    this.#controlsContainer = controlsContainer;
  }

  init() {
    this.points = [...this.#pointsModel.points];
    this.offers = this.#pointsModel.offers;
    this.destinations = this.#pointsModel.destinations;

    this.#renderFilters();
    this.#renderBoard();
  }

  #renderFilters = () => {
    const filters = generateFilter(this.points);
    render(new FilterView({ filters }), this.#headerContainer, RenderPosition.AFTERBEGIN);
  };

  #renderBoard = () => {
    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#sortViewComponent, this.#mainContainer);
    render(this.#pointListComponent, this.#mainContainer);

    if (this.points.length === 0) {
      this.#renderEmptyList();
    } else {
      this.#renderEventsList();
    }

  };

  #renderEmptyList = () => {
    render(new EmptyListView(), this.#mainContainer);
    remove(this.#sortViewComponent);
    remove(this.#infoViewComponent);
  };

  #renderEventsList = () => {
    this.points.forEach((point) => {
      const pointPresenter = new PointPresenter({
        pointListContainer: this.#pointListComponent.element
      });

      pointPresenter.init(point, this.offers, this.destinations);
    });
  };
}
