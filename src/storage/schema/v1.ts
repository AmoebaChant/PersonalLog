import { IV1Storage } from '../../dataLayer/v1/schema';

export function loadV1(data: string): IV1Storage {
  try {
    return JSON.parse(data) as IV1Storage;
  } catch (error) {
    console.error('Error parsing V1 data: ' + error);
    throw new Error('Error parsing V1 data: ' + error);
  }
}
