import { IObservable, Observable } from '../observable/observable';
import { ITag, IV1Entry, IV1Storage, IV1StorageEntry } from './schema';
import { v4 as uuidv4 } from 'uuid';
import { V1Entry } from './entry';
import { threadId } from 'worker_threads';

const TagColors: string[] = ['red', 'blue', 'green', 'purple', 'orange'];

export class V1DataLayer {
  private nextTagColorIndex = 0;
  private tagColorMap = new Map<string, string>();
  private dirtyEntryIds: string[] = [];
  private deletedEntryIds: string[] = [];
  private addedEntryIds: string[] = [];

  public readonly isDirty: IObservable<boolean> = new Observable<boolean>(false);
  public readonly entries: IObservable<IV1Entry[]> = new Observable<IV1Entry[]>([]);

  public loadFromStorage(storedData: IV1Storage) {
    const storedEntryList: IV1Entry[] = [];
    const newEntryList: IV1Entry[] = [];
    if (storedData.version !== '1') {
      throw new Error('Attempted to load an incompatible version of the data for this data layer');
    }

    // Create V1Entry objects for each entry passed in
    for (const entry of storedData.entries) {
      const newEntry = new V1Entry(
        entry.id,
        entry.tags
          ? entry.tags.map((tagString) => {
              return this.stringToTag(tagString);
            })
          : [],
        this.getTagsFromBody(entry.body),
        entry.date,
        entry.body
      );
      storedEntryList.push(newEntry);
    }

    // Reconcile with existing entry list
    let existingEntriesNotFoundInStoredEntryList: IV1Entry[] = this.entries.value.slice();
    for (const newStoredEntry of storedEntryList) {
      const matchingExistingEntries = this.entries.value.filter(
        (existingEntry) => existingEntry.id === newStoredEntry.id
      );
      if (matchingExistingEntries.length === 0) {
        if (this.deletedEntryIds.findIndex((deletedEntryId) => deletedEntryId === newStoredEntry.id) !== -1) {
          // This was locally deleted, don't include it in our new entry list
          console.log(`Reconcile: found locally deleted entry, not keeping it (id ${newStoredEntry.id}})`);
        } else {
          // This new entry didn't exist in the list previously - add it and subscribe to changes made to it
          console.log(
            `Reconcile: previously unknown entry found in the new stored entry list, adding it (id ${newStoredEntry.id}})`
          );
          newEntryList.push(newStoredEntry);
          this.subscribeToFieldChanges(newStoredEntry);
        }
      } else if (matchingExistingEntries.length === 1) {
        newEntryList.push(matchingExistingEntries[0]);

        if (this.dirtyEntryIds.findIndex((dirtyEntryId) => dirtyEntryId === newStoredEntry.id) !== -1) {
          // This was changed locally, don't apply the remote values
          console.log(
            `Reconcile: found existing entry which was locally changed, not updating the fields (id ${newStoredEntry.id}})`
          );
        } else {
          // The new entry also exists in the current list - keep the existing entry and update any changed fields
          console.log(
            `Reconcile: found existing entry in the new stored entry list, updating fields if needed (id ${newStoredEntry.id}})`
          );
          // Update fields (no-op if the value didn't change)
          matchingExistingEntries[0].body.value = newStoredEntry.body.value;
          matchingExistingEntries[0].date.value = newStoredEntry.date.value;
        }

        // Remove id from the list of existing IDs not found in the new stored entry list
        existingEntriesNotFoundInStoredEntryList = existingEntriesNotFoundInStoredEntryList.filter(
          (entry) => entry.id !== newStoredEntry.id
        );
      } else {
        // Found more than one matching existing entry!
        console.error('Found more than one existing entry with the same ID!');
        throw new Error('Found more than one existing entry with the same ID!');
      }
    }
    // Remove existing entries not found in the new stored entry list
    for (const notFoundEntry of existingEntriesNotFoundInStoredEntryList) {
      if (this.addedEntryIds.findIndex((addedEntryId) => addedEntryId === notFoundEntry.id) !== -1) {
        // This was added locally, keep it
        console.log(`Reconcile: found newly added entry, keeping it (id ${notFoundEntry.id}})`);
        newEntryList.push(notFoundEntry);
      } else {
        console.log(
          `Reconcile: removing existing entry no longer found in the new stored entry list (id ${notFoundEntry.id}})`
        );
        this.deleteEntry(notFoundEntry);
      }
    }

    // Store the new entry list
    this.entries.value = newEntryList;

    // Clear the dirty states
    this.dirtyEntryIds.length = 0;
    this.deletedEntryIds.length = 0;
    this.addedEntryIds.length = 0;
  }

  public createNewBlankEntry(): IV1Entry {
    const newEntry = new V1Entry(uuidv4(), [], [], new Date(Date.now()).toISOString(), '');
    this.addedEntryIds.push(newEntry.id);

    this.subscribeToFieldChanges(newEntry);

    const newEntriesList = [...this.entries.value, newEntry];
    this.entries.value = newEntriesList;
    this.isDirty.value = true;

    return newEntry;
  }

  public deleteEntry(entryToDelete: IV1Entry) {
    this.deletedEntryIds.push(entryToDelete.id);
    this.entries.value = this.entries.value.filter((entry) => entry.id !== entryToDelete.id);
    this.isDirty.value = true;
    for (const unsubscribe of entryToDelete.unsubscribers) {
      unsubscribe();
    }
  }

  public getTagColor(tagName: string): string {
    return this.getColor(tagName);
  }

  private getTagsFromBody(body: string): ITag[] {
    const regex = /(#\w*)/g;
    const tagStrings = body.match(regex);

    const tags: ITag[] = [];

    if (tagStrings !== null) {
      for (const tagString of tagStrings) {
        tags.push(this.stringToTag(tagString));
      }
    }

    return tags;
  }

  private stringToTag(tagString: string): ITag {
    return { name: tagString, color: this.getColor(tagString) };
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
          entry.tags.value = this.getTagsFromBody(entry.body.value);
          this.dirtyEntryIds.push(entry.id);
        },
        { notifyWithCurrentValue: false }
      )
    );
    entry.unsubscribers.push(entry.date.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
    entry.unsubscribers.push(entry.tags.subscribe(this.setIsDirty.bind(this), { notifyWithCurrentValue: false }));
  }
}
