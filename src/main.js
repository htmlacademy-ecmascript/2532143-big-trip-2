import { render } from './framework/render.js';
import FilterModel from './model/filter-model.js';
import PointsModel from './model/points-model.js';
import PointsApiService from './points-api-service.js';
import FilterPresenter from './presenter/filter-presenter.js';
import MainPresenter from './presenter/main-presenter.js';
import NewAddPointButton from './view/new-add-point-button-view.js';

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

export const newAddPointButtonComponent = new NewAddPointButton({
  onAddButtonClick: handleNewAddPointButtonClick,
});

function handleNewPointFormClose() {
  newAddPointButtonComponent.element.disabled = false;
}

function handleNewAddPointButtonClick() {
  mainPresenter.createPoint();
  newAddPointButtonComponent.element.disabled = true;
}

filterPresenter.init();
mainPresenter.init();
pointsModel.init().finally(() => {
  render(newAddPointButtonComponent, controlsContainer);
});
