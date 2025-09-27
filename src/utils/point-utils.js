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

// export function checksTravelIsSame(dueDate) {
//   return dueDate && dayjs(dueDate).isSame(dayjs(), 'D');
// }

// export function checksTravelIsBefore(dueDate) {
//   return dueDate && dayjs(dueDate).isBefore(dayjs(), 'D');
// }

// export function checksTravelIsAfter(dueDate) {
//   return dueDate && dayjs(dueDate).isAfter(dayjs(), 'D');
// }
