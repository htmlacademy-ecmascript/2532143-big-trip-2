import EventList from '/src/view/event-list-view.js';
import PointView from '/src/view/point-view.js';
import SortView from '/src/view/sort-view.js';
import EditorView from '/src/view/editor-view.js';
import InfoView from '/src/view/info-view.js';
import { render } from '/src/render.js';

export default class Presenter {
  controlsContainer = document.querySelector('.trip-main');
  mainContainer = document.querySelector('.trip-events');
  eventListComponent = new EventList();

  init() {
    render(new InfoView(), this.controlsContainer, 'afterbegin');
    render(new SortView(), this.mainContainer);
    render(this.eventListComponent, this.mainContainer);
    render(new EditorView() ,this.eventListComponent.getElement());
    for (let i = 0; i < 3; i++) {
      render(new PointView(), this.eventListComponent.getElement());
    }
  }

}
