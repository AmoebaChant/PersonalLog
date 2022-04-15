import { RootStateV1 } from '../../dataLayer/store';
import { ICommonSchema } from './loader';

interface IV1Schema extends ICommonSchema {
  data: RootStateV1;
}

export function loadV1(data: string): RootStateV1 {
  try {
    return (JSON.parse(data) as IV1Schema).data;
  } catch (error) {
    console.error('Error parsing V1 data: ' + error);
    throw new Error('Error parsing V1 data: ' + error);
  }
}
