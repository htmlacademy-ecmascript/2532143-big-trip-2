import Presenter from './presenter/presenter.js';
import FilterView from './view/filter-view.js';
import { render } from './render.js';

const mainContainer = document.querySelector('.trip-events');
const filterContainer = document.querySelector('.trip-controls__filters');
const viewPresenter = new Presenter({container: mainContainer});
render(new FilterView, filterContainer);

viewPresenter.init();
