import { IObservable, Observable } from './observable/observable';
import { store } from './store';

export interface IV1StorageEntry {
  id: string;
  date: string;
  body: string;
}

export interface IV1Storage {
  version: '1';
  entries: IV1StorageEntry[];
}

export interface IV1Entry extends IV1StorageEntry {
  tags: string[];
}

export class V1DataLayer {
  private _entries: IV1Entry[];

  public readonly isDirty: IObservable<boolean> = new Observable<boolean>(false);

  public loadFromStorage(storedData: IV1Storage) {
    this._entries.length = 0;
    if (storedData.version !== '1') {
      throw new Error('Attempted to load an incompatible version of the data for this data layer');
    }

    for (const entry of storedData.entries) {
      this._entries.push({ ...entry, tags: this.getTags(entry) });
    }
  }

  private getTags(entry: IV1StorageEntry): string[] {
    const regex = /(#\w*)/g;
    return entry.body.match(regex);
  }
}
