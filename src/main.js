import Presenter from './presenter/presenter.js';
import PointsModel from './model/point-model.js';

const mainContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const headerContainer = document.querySelector('.trip-controls');
const controlsContainer = document.querySelector('.trip-main');
const viewPresenter = new Presenter({
  container: mainContainer,
  pointsModel,
  headerContainer,
  controlsContainer
});

viewPresenter.init();
