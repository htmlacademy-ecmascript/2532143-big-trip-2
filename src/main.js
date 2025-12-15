import FilterModel from './model/filter-model.js';
import PointsModel from './model/point-model.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const mainContainer = document.querySelector('.trip-events');
const pointsModel = new PointsModel();
const headerContainer = document.querySelector('.trip-controls');
const controlsContainer = document.querySelector('.trip-main');
const filterModel = new FilterModel();
const filterPresenter = new FilterPresenter({
  filterContainer: headerContainer,
  filterModel,
  pointsModel
});
const viewPresenter = new MainPresenter({
  container: mainContainer,
  pointsModel,
  headerContainer,
  controlsContainer,
  filterModel
});

filterPresenter.init();
viewPresenter.init();
