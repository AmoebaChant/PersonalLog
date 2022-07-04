import { ICommonSchema } from '../commonSchema';
import { IObservable, IReadOnlyObservable } from '../observable/observable';

export interface IV1StorageEntry {
  id: string;
  date: string;
  body: string;
  tags: string[];
}

export interface IV1Storage extends ICommonSchema {
  version: '1';
  entries: IV1StorageEntry[];
}

export const defaultV1Storage: IV1Storage = {
  version: '1',
  entries: [] as IV1StorageEntry[]
};

export interface ITag {
  name: string;
  color: string;
}
export interface IV1Entry {
  tags: IObservable<ITag[]>;
  allTags: IReadOnlyObservable<ITag[]>;
  id: string;
  date: IObservable<string>;
  body: IObservable<string>;
  unsubscribers: (() => void)[];
}
