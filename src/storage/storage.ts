import { loadFromStorageContents } from './schema/loader';
import * as OneDrive from './oneDrive';
import { IV1Storage } from '../dataLayer/v1/schema';

export async function loadData(accessToken: string): Promise<IV1Storage> {
  const fileContents = await OneDrive.getFileContents(accessToken);

  return loadFromStorageContents(fileContents);
}

export function saveData(accessToken: string, data: IV1Storage): Promise<void> {
  return OneDrive.writeToFile(accessToken, JSON.stringify(data));
}
