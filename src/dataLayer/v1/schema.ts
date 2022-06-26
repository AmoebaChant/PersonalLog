import { ICommonSchema } from '../commonSchema';

export interface IV1StorageEntry {
  id: string;
  date: string;
  body: string;
}

export interface IV1Storage extends ICommonSchema {
  version: '1';
  entries: IV1StorageEntry[];
}

export const defaultV1Storage: IV1Storage = {
  version: '1',
  entries: [] as IV1StorageEntry[]
};

export interface IV1Entry extends IV1StorageEntry {
  tags: string[];
}
