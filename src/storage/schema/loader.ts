import { ICommonSchema } from '../../dataLayer/commonSchema';
import { V1DataLayer } from '../../dataLayer/v1/dataLayer';
import { defaultV1Storage, IV1Storage } from '../../dataLayer/v1/schema';
import { loadV1, saveV1 } from './v1';

export function loadFromStorageContents(storageContents: string | undefined): IV1Storage {
  if (storageContents === undefined) {
    return defaultV1Storage;
  }

  try {
    const commonSchema = JSON.parse(storageContents) as ICommonSchema;
    if (commonSchema === undefined) {
      return defaultV1Storage;
    }
    switch (commonSchema.version) {
      case '1': {
        return loadV1(storageContents);
      }
      default: {
        return defaultV1Storage;
      }
    }
  } catch (error) {
    console.error('Failed to load from storage contents: ' + error);
    return defaultV1Storage;
  }
}

export function serializeToString(dataLayer: V1DataLayer): string {
  return saveV1(dataLayer);
}
