import EventListView from '/src/view/event-list-view.js';
import PointView from '/src/view/point-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import EditorView from '/src/view/editor-view.js';
import InfoView from '/src/view/info-view.js';
import EmptyListView from '../view/empty-list-view.js';
import { generateFilter } from '../mocks/trip-filter.js';
import { remove, render, RenderPosition, replace } from '../framework/render.js';

export default class Presenter {
  #mainContainer;
  #pointsModel;
  #headerContainer;
  #controlsContainer;
  #eventListComponent = new EventListView();
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

    const filters = generateFilter(this.points);
    render(new FilterView({filters}), this.#headerContainer, RenderPosition.AFTERBEGIN);

    this.#renderBoard();
  }

  #renderBoard = () => {
    render(this.#infoViewComponent, this.#controlsContainer, RenderPosition.AFTERBEGIN);
    render(this.#sortViewComponent, this.#mainContainer);
    render(this.#eventListComponent, this.#mainContainer);

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
      const escKeyDownHandler = (evt) => {
        if (evt.key === 'Escape') {
          evt.preventDefault();
          replaceFormToPoint();
          document.removeEventListener('keydown', escKeyDownHandler);
        }
      };

      const editorView = new EditorView({
        point: point,
        destinations: this.destinations,
        offers: this.offers,
        onEditClick: () => {
          replaceFormToPoint();
        },
        onFormSubmit: () => {
          replaceFormToPoint();
        },
      });

      const newPoint = new PointView({
        point: point,
        destinations: this.destinations,
        offers: this.offers,
        onEditClick: () => {
          replacePointToForm();
        },
      });

      function replacePointToForm() {
        replace(editorView, newPoint);
        document.addEventListener('keydown', escKeyDownHandler);
      }

      function replaceFormToPoint() {
        replace(newPoint, editorView);
        document.removeEventListener('keydown', escKeyDownHandler);
      }

      render(newPoint, this.#eventListComponent.element);
    });
  };

}
