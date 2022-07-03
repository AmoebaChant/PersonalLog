import { IObservable, Observable } from '../dataLayer/observable/observable';
import { IFilter } from './filterContext';

export class Filter implements IFilter {
  public sort: 'DateDesc' = 'DateDesc';

  public tagsRequired: IObservable<string[]> = new Observable<string[]>([]);

  constructor() {
    const params = new URLSearchParams(location.search);
    const filters = params.get('filters');

    if (filters !== null && filters.length > 0) {
      this.tagsRequired.value = filters.split(',').filter((tagName) => tagName.length > 0);
    }

    this.tagsRequired.subscribe(
      () => {
        window.history.replaceState(
          {},
          '',
          `${location.pathname}?filters=${this.tagsRequired.value.map((tagName) => `${tagName},`)}`
        );
      },
      { notifyWithCurrentValue: false }
    );
  }

  public removeRequiredTag(tagName: string): void {
    const newRequiredTagList = this.tagsRequired.value.filter((requiredTagName) => tagName !== requiredTagName);
    this.tagsRequired.value = newRequiredTagList;
  }

  public addRequiredTag(tagName: string): void {
    const val = this.tagsRequired.value.findIndex((requiredTagName) => requiredTagName === tagName);
    if (val === -1) {
      const newRequiredTagList = this.tagsRequired.value.slice();
      newRequiredTagList.push(tagName);
      this.tagsRequired.value = newRequiredTagList;
    }
  }
}
