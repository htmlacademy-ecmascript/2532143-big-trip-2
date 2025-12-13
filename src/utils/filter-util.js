import { FilterTypes } from '../const.js';
import { ChecksTravelDate } from './point-utils.js';

export const filter = {
  [FilterTypes.EVERYTHING]: (points) => points,
  [FilterTypes.FUTURE]: (points) => points.filter((point) => ChecksTravelDate.FUTURE(point.dateFrom)),
  [FilterTypes.PAST]: (points) => points.filter((point) => ChecksTravelDate.PAST(point.dateFrom)),
  [FilterTypes.PRESENT]: (points) => points.filter((point) => ChecksTravelDate.PRESENT(point.dateFrom))
};
