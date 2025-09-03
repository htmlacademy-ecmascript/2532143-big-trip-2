import { mockPoints } from '../mocks/trip-points.js';

export default class PointsModel {
  points = mockPoints;

  getPoints() {
    return this.points;
  }
}
