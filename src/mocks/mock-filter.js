import { filter } from '../utils/filter-util.js';

export function generateFilter(points) {
  return Object.entries(filter).map(
    ([filterTypes, filterPoints]) => ({
      type: filterTypes,
      count: filterPoints(points).length
    }),
  );
}
