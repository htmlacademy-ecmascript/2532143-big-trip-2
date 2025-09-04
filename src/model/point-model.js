import { mockPoints } from '../mocks/trip-points.js';
import { mockDestinations } from '../mocks/trip-destinations.js';
import { mockOffers } from '../mocks/trip-offers.js';

export default class PointsModel {
  points = mockPoints;
  destinations = mockDestinations;
  offers = mockOffers;

  getPoints() {
    return this.points;
  }

  getDestinations() {
    return this.destinations;
  }

  getOffers() {
    return this.offers;
  }
}
