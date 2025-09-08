export const POINT_TYPES = [
  'Taxi',
  'Bus',
  'Train',
  'Ship',
  'Drive',
  'Flight',
  'Check-in',
  'Sightseeing',
  'Restaurant'
];

export const DATE_FORMATS = {
  mins: 'MM',
  hoursMins: 'HH:mm',
  daysHoursMins: 'DD:HH:mm',
  day: 'MMM D'
};

export const DURATION_FORMATS = {
  minutes: {
    max: 60,
    format: (mins) => `${mins} M`
  },
  hours: {
    max: 1440,
    format: (mins) => `${Math.floor(mins / 60)} H ${mins % 60} M`
  },
  days: {
    max: Infinity,
    format: (mins) => `${Math.floor(mins / 1440)} D ${Math.floor((mins % 1440) / 60)} H ${mins % 60} M`
  }
};
