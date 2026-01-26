import dayjs from 'dayjs';
import { DurationFormats } from '../const.js';

export function humanizeDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function formatDurationValue(value, symbol) {
  return `${String(value).padStart(2, '0')}${symbol}`;
}

export function calculateTripDuration(startTime, endTime) {
  const mins = dayjs(endTime).diff(startTime, 'minute');
  return Object.values(DurationFormats).find(({max}) => mins < max).format(mins);
}

export const ChecksTravelDate = {
  FUTURE: (dueDate) => dueDate && dayjs(dueDate).isAfter(dayjs(), 'D'),
  PAST: (dueDate) => dueDate && dayjs(dueDate).isBefore(dayjs(), 'D'),
  PRESENT: (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D')
};

export function sortByPrice(pointA, pointB) {
  return pointB.basePrice - pointA.basePrice;
}

export function sortByTime(pointA, pointB) {
  const pointADuration = getPointDuration(pointA);
  const pointBDuration = getPointDuration(pointB);

  return pointBDuration - pointADuration;
}

export function sortByDay(pointA, pointB) {
  return dayjs(pointA.dateFrom) - dayjs(pointB.dateFrom);
}

export function getPointDuration(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}

export function isDatesEqual(dateA, dateB) {
  return (dateA === null && dateB === null) || dayjs(dateA).isSame(dateB, 'D');
}

export function isPriceEqual(priceA, priceB) {
  return (priceA === null && priceB === null) || priceA === priceB;
}
