import { RootStateV1 } from '../dataLayer/store';
import { convertForSavingToStorage, loadFromStorageContents } from './schema/loader';
import * as OneDrive from './oneDrive';

export async function loadData(accessToken: string): Promise<RootStateV1> {
  const fileContents = await OneDrive.getFileContents(accessToken);

  return loadFromStorageContents(fileContents);
}

export function saveData(accessToken: string, data: RootStateV1): Promise<void> {
  return OneDrive.writeToFile(accessToken, convertForSavingToStorage(data));
}
