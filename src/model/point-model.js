import { mockPoints } from '../mocks/mock-points.js';
import { mockDestinations } from '../mocks/mock-destinations.js';
import { mockOffers } from '../mocks/mock-offers.js';
import Observable from '../framework/observable.js';
import { updateItem } from '../utils/command-utils.js';

export default class PointsModel extends Observable {
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  set points(points) {
    this.#points = [...points];
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }

  updatePoint(updateType, updatedPoint) {
    this.#points = updateItem(this.#points, updatedPoint);

    this._notify(updateType, updatedPoint.id);
  }

  addPoint(updateType, newPoint) {
    this.#points.push(newPoint);

    this._notify(updateType);
  }

  deletePoint(updateType, point) {
    this.#points = this.#points.filter((item) => item.id !== point.id);

    this._notify(updateType);
  }
}
