import { mockPoints } from '../mocks/trip-points.js';
import { mockDestinations } from '../mocks/trip-destinations.js';
import { mockOffers } from '../mocks/trip-offers.js';

export default class PointsModel {
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
