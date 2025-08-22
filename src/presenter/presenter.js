import EventList from '/src/view/event-list-view.js';
import PointView from '/src/view/point-view.js';
import SortView from '/src/view/sort-view.js';
import { render } from '/src/render.js';

export default class Presenter {
  sortComponent = new SortView();
  eventListComponent = new EventList();

  constructor({ container }) {
    this.container = container;
  }

  init() {
    render(this.sortComponent, this.container);
    render(this.eventListComponent, this.container);

    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }

}
