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
      newEntryList.push({ ...entry, tags: this.getTags(entry) });
    }

    this.entries.value = newEntryList;
  }

  public getDataToSave(): IV1Storage {
    return {
      version: '1',
      entries: this.entries.value.map((entry) => {
        return { ...entry, tags: undefined };
      })
    };
  }

  public createNewBlankEntry(): void {
    const newEntry: IV1Entry = { id: uuidv4(), date: new Date(Date.now()).toISOString(), body: 'New entry', tags: [] };

    const newEntriesList = [...this.entries.value, newEntry];
    this.entries.value = newEntriesList;
    this.isDirty.value = true;
  }

  private getTags(entry: IV1StorageEntry): string[] {
    const regex = /(#\w*)/g;
    return entry.body.match(regex);
  }
}
