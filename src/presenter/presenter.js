import EventList from '/src/view/point-list-view.js';
import PointView from '/src/view/point-view.js';
import SortView from '/src/view/sort-view.js';
import EditorView from '/src/view/editor-view.js';
import InfoView from '/src/view/info-view.js';
import { render } from '/src/render.js';

export default class Presenter {
  constructor({container, pointsModel}) {
    this.mainContainer = container;
    this.pointsModel = pointsModel;
  }

  controlsContainer = document.querySelector('.trip-main');
  eventListComponent = new EventList();

  init() {
    this.points = [...this.pointsModel.getPoints()];
    this.offers = this.pointsModel.getOffers();
    this.destinations = this.pointsModel.getDestinations();

    render(new InfoView(), this.controlsContainer, 'afterbegin');
    render(new SortView(), this.mainContainer);
    render(this.eventListComponent, this.mainContainer);
    render(new EditorView({
      point: this.points[0],
      destinations: this.destinations,
      offers: this.offers
    }) ,this.eventListComponent.getElement());

    this.points.forEach((point) => {
      render(new PointView({point, destinations: this.destinations, offers: this.offers}), this.eventListComponent.getElement());
    });
  }
}
