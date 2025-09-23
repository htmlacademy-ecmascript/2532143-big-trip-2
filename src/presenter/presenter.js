import EventList from '/src/view/point-list-view.js';
import PointView from '/src/view/point-view.js';
import SortView from '/src/view/sort-view.js';
import FilterView from '../view/filter-view.js';
import EditorView from '/src/view/editor-view.js';
import InfoView from '/src/view/info-view.js';
import { render, replace } from '../framework/render.js';

export default class Presenter {
  #mainContainer;
  #pointsModel;
  #headerContainer = document.querySelector('.trip-controls');
  #controlsContainer = document.querySelector('.trip-main');
  #eventListComponent = new EventList();

  constructor({container, pointsModel}) {
    this.#mainContainer = container;
    this.#pointsModel = pointsModel;
  }

  init() {
    this.points = [...this.#pointsModel.points];
    this.offers = this.#pointsModel.offers;
    this.destinations = this.#pointsModel.destinations;

    render(new FilterView(), this.#headerContainer, 'afterbegin');
    render(new InfoView(), this.#controlsContainer, 'afterbegin');
    render(new SortView(), this.#mainContainer);
    render(this.#eventListComponent, this.#mainContainer);

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
          document.removeEventListener('keydown', escKeyDownHandler);
        },
      });

      const newPoint = new PointView({
        point: point,
        destinations: this.destinations,
        offers: this.offers,
        onEditClick: () => {
          replacePointToForm();
          document.addEventListener('keydown', escKeyDownHandler);
        },
      });

      function replacePointToForm() {
        replace(editorView, newPoint);
      }

      function replaceFormToPoint() {
        replace(newPoint, editorView);
      }

      render(newPoint, this.#eventListComponent.element);
    });
  }
}
