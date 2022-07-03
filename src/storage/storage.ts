import { loadFromStorageContents } from './schema/loader';
import * as OneDrive from './oneDrive';
import { IV1Storage } from '../dataLayer/v1/schema';

const FILE_NAME = 'PersonalLog/PersonalLog.json';

export async function loadData(accessToken: string): Promise<IV1Storage> {
  const fileContents = await OneDrive.getFileContents(accessToken, FILE_NAME);

  return loadFromStorageContents(fileContents);
}

export function saveData(accessToken: string, data: IV1Storage): Promise<void> {
  return OneDrive.writeToFile(accessToken, FILE_NAME, JSON.stringify(data));
}

export function backupDataToStorage(accessToken: string, data: IV1Storage): Promise<void> {
  return OneDrive.writeNewFile(
    accessToken,
    `PersonalLog/Backup/PersonalLogBackup_${new Date(Date.now()).toISOString().split(':').join('.')}.json`,
    JSON.stringify(data)
  );
}
