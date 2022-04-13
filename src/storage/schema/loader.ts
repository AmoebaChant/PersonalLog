import { defaultRootState, RootStateV1 } from '../../dataLayer/store';
import { loadV1 } from './v1';

export interface ICommonSchema {
  version: string;
}

export function loadFromStorageContents(storageContents: string | undefined): RootStateV1 {
  if (storageContents === undefined) {
    return defaultRootState;
  }

  try {
    const commonSchema = JSON.parse(storageContents) as ICommonSchema;
    if (commonSchema === undefined) {
      return defaultRootState;
    }
    switch (commonSchema.version) {
      case '1': {
        return loadV1(storageContents);
      }
      default: {
        return defaultRootState;
      }
    }
  } catch (error) {
    console.error('Failed to load from storage contents: ' + error);
    return defaultRootState;
  }
}

export function convertForSavingToStorage(state: RootStateV1): string {
  const objectToSave = {
    version: '1',
    data: state
  };

  return JSON.stringify(objectToSave);
}
