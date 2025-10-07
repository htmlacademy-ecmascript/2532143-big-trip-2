import PointsModel from './model/point-model.js';
import MainPresenter from './presenter/main-presenter.js';

const mainContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const headerContainer = document.querySelector('.trip-controls');
const controlsContainer = document.querySelector('.trip-main');
const viewPresenter = new MainPresenter({
  container: mainContainer,
  pointsModel,
  headerContainer,
  controlsContainer
});

viewPresenter.init();
