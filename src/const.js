import { formatDurationValue } from './utils/point-utils.js';

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
    format: (mins) => `${formatDurationValue(mins, 'M')}`
  },
  HOURS: {
    max: 1440,
    format: (mins) => {
      const hours = Math.floor(mins / 60);
      const minutes = mins % 60;
      return `${formatDurationValue(hours, 'H')} ${formatDurationValue(minutes, 'M')}`;
    }
  },
  DAYS: {
    max: Infinity,
    format: (mins) => {
      const days = Math.floor(mins / 1440);
      const hours = Math.floor((mins % 1440) / 60);
      const minutes = mins % 60;
      return `${formatDurationValue(days, 'D')} ${formatDurationValue(hours, 'H')} ${formatDurationValue(minutes, 'M')}`;
    }
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

export const UserAction = {
  UPDATE_POINT: 'UPDATE_POINT',
  ADD_POINT: 'ADD_POINT',
  DELETE_POINT: 'DELETE_POINT',
};

export const UpdateType = {
  PATCH: 'PATCH',
  MINOR: 'MINOR',
  MAJOR: 'MAJOR',
  INIT: 'INIT',
  INIT_ERROR: 'INIT_ERROR'
};

export const DEFAULT_FILTER_TYPE = FilterTypes.EVERYTHING;
export const DEFAULT_SORT_TYPE = SortTypes.DAY.name;

export const BLANK_POINT = {
  basePrice: 0,
  dateFrom: null,
  dateTo: null,
  destination: null,
  isFavorite: false,
  offers: [],
  type: 'flight'
};

export const MIN_DESTINATIONS_COUNT = 3;
