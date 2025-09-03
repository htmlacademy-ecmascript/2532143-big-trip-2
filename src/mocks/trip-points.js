import { getRandomArrayElement } from '../utils.js';

export const mockPoints = [
  {
    id : 1,
    basePrice: 1100,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 1,
    isFavorite: false,
    offers: [1, 2],
    type: 'taxi'
  },
  {
    id : 2,
    basePrice: 110,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 2,
    isFavorite: false,
    offers: [],
    type: 'ship'
  },
  {
    id : 3,
    basePrice: 200,
    dateFrom: '2019-07-10T22:55:56.845Z',
    dateTo: '2019-07-11T11:22:13.375Z',
    destination: 3,
    isFavorite: true,
    offers: [4],
    type: 'flight'
  }
];

export function getRandomPoint() {
  return getRandomArrayElement(mockPoints);
}
