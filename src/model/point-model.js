import { mockPoints } from '../mocks/mock-points.js';
import { mockDestinations } from '../mocks/mock-destinations.js';
import { mockOffers } from '../mocks/mock-offers.js';
import Observable from '../framework/observable.js';

export default class PointsModel extends Observable {
  #points = mockPoints;
  #destinations = mockDestinations;
  #offers = mockOffers;

  get points() {
    return this.#points;
  }

  get destinations() {
    return this.#destinations;
  }

  get offers() {
    return this.#offers;
  }
}
