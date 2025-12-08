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

export const DateFormats = {
  MINS: 'MM',
  HOURS: 'HH:mm',
  DAYS: 'DD:HH:mm',
  MONTH: 'MMM D'
};

export const FilterTypes = {
  EVERYTHING: 'everything',
  FUTURE: 'future',
  PRESENT: 'present',
  PAST: 'past'
};

export const EmptyListMessages = {
  EVERYTHING: 'Click New Event to create your first point',
  FUTURE: 'There are no future events now',
  PRESENT: 'There are no present events now',
  PAST: 'There are no past events now'
};

export const DurationFormats = {
  MINUTES: {
    max: 60,
    format: (mins) => `${mins} M`
  },
  HOURS: {
    max: 1440,
    format: (mins) => `${Math.floor(mins / 60)} H ${mins % 60} M`
  },
  DAYS: {
    max: Infinity,
    format: (mins) => `${Math.floor(mins / 1440)} D ${Math.floor((mins % 1440) / 60)} H ${mins % 60} M`
  }
};

export const SortTypes = {
  DAY: {
    name: 'day',
    isEnabled: true,
  },
  EVENT: {
    name: 'event',
    isEnabled: false,
  },
  TIME: {
    name: 'time',
    isEnabled: true,
  },
  PRICE: {
    name: 'price',
    isEnabled: true,
  },
  OFFERS: {
    name: 'offers',
    isEnabled: false,
  }
};

export const DEFAULT_FILTER_TYPE = FilterTypes.EVERYTHING;
export const DEFAULT_SORT_TYPE = SortTypes.DAY.name;
