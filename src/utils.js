import dayjs from 'dayjs';
import { DURATION_FORMATS } from './consts.js';

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function humanizeDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function tripDuration(startTime, endTime) {
  const mins = dayjs(endTime).diff(startTime, 'minute');
  return Object.values(DURATION_FORMATS).find(({max}) => mins < max).format(mins);
}
