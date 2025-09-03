import dayjs from 'dayjs';

export function getRandomArrayElement(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function humanizeDate(date, format) {
  return date ? dayjs(date).format(format) : '';
}

export function tripDuration(startTime, endTime) {
  const durationInMinutes = dayjs(endTime).diff(startTime, 'minute');
  if (durationInMinutes < 60) {
    return `${durationInMinutes} M`;
  } else if (durationInMinutes < 1440) {
    const hours = Math.floor(durationInMinutes / 60);
    const minutes = durationInMinutes % 60;
    return `${hours} H ${minutes} M`;
  } else {
    const days = Math.floor(durationInMinutes / 1440);
    const hours = Math.floor((durationInMinutes % 1440) / 60);
    const minutes = durationInMinutes % 60;
    return `${days} D ${hours} H ${minutes} M`;
  }
}

export function checkFavorite(item) {
  return (item) ? 'event__favorite-btn--active' : '';
}
