import dayjs from 'dayjs';
import { DurationFormats } from '../consts.js';

export function humanizeDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function tripDuration(startTime, endTime) {
  const mins = dayjs(endTime).diff(startTime, 'minute');
  return Object.values(DurationFormats).find(({max}) => mins < max).format(mins);
}

export const ChecksTravelDate = {
  FUTURE: (dueDate) => dueDate && dayjs(dueDate).isAfter(dayjs(), 'D'),
  PAST: (dueDate) => dueDate && dayjs(dueDate).isBefore(dayjs(), 'D'),
  PRESENT: (dueDate) => dueDate && dayjs(dueDate).isSame(dayjs(), 'D')
};

export function sortByPrice(pointA, pointB) {
  return pointA.basePrice - pointB.basePrice;
}

export function sortByTime(pointA, pointB) {
  const pointADuration = getPointDuration(pointA);
  const pointBDuration = getPointDuration(pointB);

  return pointBDuration - pointADuration;
}

export function getPointDuration(point) {
  return dayjs(point.dateTo).diff(dayjs(point.dateFrom));
}
