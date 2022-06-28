import { IObservable, Observable } from '../observable/observable';
import { ITag, IV1Entry, IV1Storage, IV1StorageEntry } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { V1Entry } from './entry';

const TagColors: string[] = ['red', 'blue', 'green', 'purple', 'orange'];

export class V1DataLayer {
  private nextTagColorIndex = 0;
  private tagColorMap = new Map<string, string>();

  public readonly isDirty: IObservable<boolean> = new Observable<boolean>(false);
  public readonly entries: IObservable<IV1Entry[]> = new Observable<IV1Entry[]>([]);

  public loadFromStorage(storedData: IV1Storage) {
    const newEntryList: IV1Entry[] = [];
    if (storedData.version !== '1') {
      throw new Error('Attempted to load an incompatible version of the data for this data layer');
    }

    for (const entry of storedData.entries) {
      const newEntry = new V1Entry(entry.id, this.getTags(entry.body), entry.date, entry.body);

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
    const newEntry = new V1Entry(uuidv4(), [], new Date(Date.now()).toISOString(), '');

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

  public getTagColor(tagName: string): string {
    return this.getColor(tagName);
  }

  private getTags(body: string): ITag[] {
    const regex = /(#\w*)/g;
    const tagStrings = body.match(regex);

    const tags: ITag[] = [];

    if (tagStrings !== null) {
      for (const tagString of tagStrings) {
        tags.push({ name: tagString, color: this.getColor(tagString) });
      }
    }

    return tags;
  }

  private getColor(tag: string): string {
    if (this.tagColorMap.has(tag)) {
      return this.tagColorMap.get(tag);
    } else {
      const color = TagColors[this.nextTagColorIndex];
      this.nextTagColorIndex = (this.nextTagColorIndex + 1) % TagColors.length;
      this.tagColorMap.set(tag, color);
      return color;
    }
  }

  private setIsDirty(): void {
    this.isDirty.value = true;
  }

  private subscribeToFieldChanges(entry: IV1Entry): void {
    // Subscribe to set the dirty bit if any fields are changed
    entry.unsubscribers.push(
      entry.body.subscribe(
        () => {
          this.setIsDirty.bind(this);
          entry.tags.value = this.getTags(entry.body.value);
        },
        { notifyWithCurrentValue: false }
      )
    );
    entry.unsubscribers.push(entry.date.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
    entry.unsubscribers.push(entry.tags.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
  }
}
