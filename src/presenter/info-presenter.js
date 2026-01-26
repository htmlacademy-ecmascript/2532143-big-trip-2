import { MIN_DESTINATIONS_COUNT } from '../const.js';
import { render, replace, remove, RenderPosition } from '../framework/render.js';
import { humanizeDate } from '../utils/point-utils.js';
import InfoView from '../view/info-view.js';

export default class InfoPresenter {
  #container = null;
  #pointsModel = null;

  #infoViewComponent = null;

  constructor({ container, pointsModel }) {
    this.#container = container;
    this.#pointsModel = pointsModel;

    this.#pointsModel.addObserver(this.#handleModelEvent);
  }

  init() {
    const points = this.#pointsModel.points;
    if (points.length === 0) {
      if (this.#infoViewComponent) {
        remove(this.#infoViewComponent);
        this.#infoViewComponent = null;
      }
      return;
    }

    this.#getInfoViewComponent(points);
  }

  #getInfoViewComponent = (points) => {
    const sortedPoints = [...points].sort((a, b) => new Date(a.dateFrom) - new Date(b.dateFrom));

    const route = this.#getDestinationNames(sortedPoints);
    const dates = this.#getPointDates(sortedPoints);
    const totalCost = this.#getTotalCost(points);

    const tripInfoData = { route, dates, totalCost };
    const prevTripInfoComponent = this.#infoViewComponent;

    this.#infoViewComponent = new InfoView(tripInfoData);

    if (prevTripInfoComponent === null) {
      render(this.#infoViewComponent, this.#container, RenderPosition.AFTERBEGIN);
    } else {
      replace(this.#infoViewComponent, prevTripInfoComponent);
      remove(prevTripInfoComponent);
    }
  };

  #getTotalCost = (points) => {
    const allOffersByType = this.#pointsModel.offers;

    return points.reduce((totalSum, point) => {
      const pointTotal = point.basePrice ?? 0;

      const offersForType = allOffersByType
        .find((offerGroup) => offerGroup.type === point.type)
        ?.offers || [];

      const selectedOffers = offersForType.filter((offer) =>
        point.offers.includes(offer.id)
      );

      const offersSum = selectedOffers.reduce(
        (sum, offer) => sum + offer.price,
        0
      );

      return totalSum + pointTotal + offersSum;
    }, 0);
  };

  #getPointDates = (sortedPoints) => {
    const tripStart = sortedPoints[0].dateFrom;
    const tripEnd = sortedPoints[sortedPoints.length - 1].dateTo;

    const formattedStart = humanizeDate(tripStart, 'D MMM');
    const formattedEnd = humanizeDate(tripEnd, 'D MMM');
    return `${formattedStart} - ${formattedEnd}`;
  };

  #getDestinationNames = (sortedPoints) => {
    if (!sortedPoints) {
      return '';
    }
    const destinationNames = sortedPoints.map((point) => {
      const destination = this.#pointsModel.destinations.find((dest) => dest.id === point.destination);
      return destination ? destination.name : '';
    });

    return destinationNames.length <= MIN_DESTINATIONS_COUNT
      ? destinationNames.join(' — ')
      : `${destinationNames[0]} — ... — ${destinationNames.at(-1)}`;
  };

  #handleModelEvent = () => {
    this.init();
  };
}
