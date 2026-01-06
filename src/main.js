import { render } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/point-model.js';
import PointsApiService from './points-api-service.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import NewAddPointButton from './view/add-new-point-button-view.js';

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
  onNewPointDestroy: handleNewPointFormClose
});

const newPointButtonComponent = new NewAddPointButton({
  onAddButtonClick: handleNewAddButtonClick,
});

function handleNewPointFormClose() {
  newPointButtonComponent.element.disabled = false;
}

function handleNewAddButtonClick() {
  mainPresenter.createPoint();
  newPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
mainPresenter.init();
pointsModel.init().then(() => {
  render(newPointButtonComponent, controlsContainer);
});
