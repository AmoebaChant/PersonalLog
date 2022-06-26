import { IObservable, Observable } from '../observable/observable';
import { IV1Entry, IV1Storage, IV1StorageEntry } from './schema';
import { v4 as uuidv4 } from 'uuid';

export class V1DataLayer {
  public readonly isDirty: IObservable<boolean> = new Observable<boolean>(false);
  public readonly entries: IObservable<IV1Entry[]> = new Observable<IV1Entry[]>([]);

  public loadFromStorage(storedData: IV1Storage) {
    const newEntryList: IV1Entry[] = [];
    if (storedData.version !== '1') {
      throw new Error('Attempted to load an incompatible version of the data for this data layer');
    }

    for (const entry of storedData.entries) {
      const newEntry: IV1Entry = {
        tags: this.getTags(entry),
        id: entry.id,
        date: new Observable<string>(entry.date),
        body: new Observable<string>(entry.body),
        unsubscribers: []
      };

      this.subscribeToFieldChanges(newEntry);

      newEntryList.push(newEntry);
    }

    this.entries.value = newEntryList;
  }

  public getDataToSave(): IV1Storage {
    return {
      version: '1',
      entries: this.entries.value.map((entry) => {
        return {
          id: entry.id,
          date: entry.date.value,
          body: entry.body.value,
          tags: undefined
        };
      })
    };
  }

  public createNewBlankEntry(): IV1Entry {
    const newEntry: IV1Entry = {
      id: uuidv4(),
      date: new Observable<string>(new Date(Date.now()).toISOString()),
      body: new Observable<string>(''),
      tags: [],
      unsubscribers: []
    };

    this.subscribeToFieldChanges(newEntry);

    const newEntriesList = [...this.entries.value, newEntry];
    this.entries.value = newEntriesList;
    this.isDirty.value = true;

    return newEntry;
  }

  public deleteEntry(entryToDelete: IV1Entry) {
    this.entries.value = this.entries.value.filter((entry) => entry.id !== entryToDelete.id);
    this.isDirty.value = true;
    for (const unsubscribe of entryToDelete.unsubscribers) {
      unsubscribe();
    }
  }

  private getTags(entry: IV1StorageEntry): string[] {
    const regex = /(#\w*)/g;
    return entry.body.match(regex);
  }

  private setIsDirty(): void {
    this.isDirty.value = true;
  }

  private subscribeToFieldChanges(entry: IV1Entry): void {
    // Subscribe to set the dirty bit if any fields are changed
    entry.unsubscribers.push(entry.body.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
    entry.unsubscribers.push(entry.date.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
  }
}
