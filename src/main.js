import Presenter from './presenter/presenter.js';
import FilterView from './view/filter-view.js';
import PointsModel from './model/point-model.js';
import { render } from './framework/render.js';

const headerContainer = document.querySelector('.trip-controls');
const mainContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel();
const viewPresenter = new Presenter({container: mainContainer, pointsModel});


render(new FilterView, headerContainer, 'afterbegin');

viewPresenter.init();
