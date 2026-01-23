import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import PointsApiService from './points-api-service.js';
import FilterPresenter from './presenter/filter-presenter.js';
import InfoPresenter from './presenter/info-presenter.js';
import MainPresenter from './presenter/main-presenter.js';

const AUTHORIZATION = 'Basic eo0w590ik29800a';
const END_POINT = 'https://22.objects.htmlacademy.pro/big-trip';

const mainContainer = document.querySelector('.trip-events');

const pointsModel = new PointsModel({
  pointsApiService: new PointsApiService(END_POINT, AUTHORIZATION)
});

const headerContainer = document.querySelector('.trip-controls');
const controlsContainer = document.querySelector('.trip-main');

const filterModel = new FilterModel();

const filterPresenter = new FilterPresenter({
  filterContainer: headerContainer,
  filterModel,
  pointsModel
});

const mainPresenter = new MainPresenter({
  container: mainContainer,
  pointsModel,
  headerContainer,
  controlsContainer,
  filterModel,
});

const infoPresenter = new InfoPresenter({
  container: controlsContainer,
  pointsModel: pointsModel
});

filterPresenter.init();
mainPresenter.init();
pointsModel.init().then(() => {
  infoPresenter.init();
});
