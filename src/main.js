import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';

const mainContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const viewPresenter = new Presenter({container: mainContainer, pointsModel});

viewPresenter.init();
