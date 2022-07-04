import { loadFromStorageContents as loadFromSerializedString, serializeToString } from './schema/loader';
import * as OneDrive from './oneDrive';
import { IV1Storage } from '../dataLayer/v1/schema';
import { V1DataLayer } from '../dataLayer/v1/dataLayer';

const FILE_NAME = 'PersonalLog/PersonalLog.json';

export async function loadDataFromStorage(accessToken: string): Promise<IV1Storage> {
  const fileContents = await OneDrive.getFileContents(accessToken, FILE_NAME);

  return loadFromSerializedString(fileContents);
}

export async function saveAndBackupDataToStorage(accessToken: string, dataLayer: V1DataLayer): Promise<void> {
  const data = serializeToString(dataLayer);
  await Promise.all([saveData(accessToken, data), backupDataToStorage(accessToken, data)]);
}

function saveData(accessToken: string, data: string): Promise<void> {
  return OneDrive.writeToFile(accessToken, FILE_NAME, data);
}

function backupDataToStorage(accessToken: string, data: string): Promise<void> {
  return OneDrive.writeToFile(
    accessToken,
    `PersonalLog/Backup/PersonalLogBackup_${new Date(Date.now()).toISOString().split(':').join('.')}.json`,
    data
  );
}
