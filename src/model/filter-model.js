import { DEFAULT_FILTER_TYPE } from '../const.js';
import Observable from '../framework/observable.js';


export default class FilterModel extends Observable {
  #filter = DEFAULT_FILTER_TYPE;

  get filter() {
    return this.#filter;
  }

  setFilter(updateType, filter) {
    this.#filter = filter;
    this._notify(updateType);
  }
}
