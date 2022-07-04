import { V1DataLayer } from '../../dataLayer/v1/dataLayer';
import { ITag, IV1Storage } from '../../dataLayer/v1/schema';

export function loadV1(serializedData: string): IV1Storage {
  try {
    return JSON.parse(serializedData) as IV1Storage;
  } catch (error) {
    console.error('Error parsing V1 data: ' + error);
    throw new Error('Error parsing V1 data: ' + error);
  }
}

export function saveV1(dataLayer: V1DataLayer): string {
  const toSerialize: IV1Storage = {
    version: '1',
    entries: dataLayer.entries.value.map((entry) => {
      return {
        id: entry.id,
        date: entry.date.value,
        body: entry.body.value,
        tags: entry.tags.value.map((tag: ITag) => {
          return tag.name;
        })
      };
    })
  };
  return JSON.stringify(toSerialize);
}
