import Presenter from './presenter/presenter.js';
import FilterView from './view/filter-view.js';
import { render } from './render.js';

const controlsContainer = document.querySelector('.trip-controls');
const viewPresenter = new Presenter();
render(new FilterView, controlsContainer, 'afterbegin');

viewPresenter.init();
