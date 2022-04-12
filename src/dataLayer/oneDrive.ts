import { RootState } from './store';
import * as graph from '@microsoft/microsoft-graph-client';
import { json } from 'stream/consumers';

interface IFileItem {
  id: string;
  name: string;
  remoteItem: {
    folder: {
      childCount: number;
    };
    id: string;
    parentReference: {
      driveId: string;
    };
  };
  [name: string]: any;
}

function getAuthenticatedClient(accessToken: string) {
  const authProvider = (done: any) => {
    done(null, accessToken);
  };

  // Initialize Graph client
  const client = graph.Client.init({
    // Use the provided access token to authenticate
    // requests
    authProvider
  });

  return client;
}

// TODO: don't recreate client each time
async function findFiles(accessToken: string, fileName: string): Promise<IFileItem[]> {
  const client = getAuthenticatedClient(accessToken);
  const fileQuery = await client.api("/me/drive/root/search(q='" + fileName + "')").get();
  return fileQuery.value;
}

async function getFileContents(accessToken: string, fileName: string): Promise<string | undefined> {
  const client = getAuthenticatedClient(accessToken);
  const fileQuery = await client.api('https://graph.microsoft.com/v1.0/me/drive/root:/' + fileName).get();
  const itemId = fileQuery.id;
  const downloadUrlResponse = await client.api('https://graph.microsoft.com/v1.0/me/drive/items/' + itemId + '?select=id,@microsoft.graph.downloadUrl').get();
  const downloadUrl = downloadUrlResponse['@microsoft.graph.downloadUrl'];
  window.performance.mark('OneDriveDownloadStart');
  const response = await fetch(downloadUrl);
  window.performance.measure('OneDriveDownload', 'OneDriveDownloadStart');

  if (response.ok) {
    return await response.text();
  } else {
    throw new Error('Fetch failure: ' + response.statusText);
  }
}

export async function loadDataFromOneDrive(accessToken: string): Promise<RootState> {
  const fileContents = await getFileContents(accessToken, 'PersonalLog.json');

  if (fileContents === undefined) {
    return {};
  }

  return JSON.parse(fileContents) as RootState;

  // const matchingFiles = await findFiles(accessToken, 'PersonalLog.json');
  // if (matchingFiles && matchingFiles.length >= 1) {
  //   window.performance.mark('OneDriveDownloadStart');
  //   const response = await fetch(matchingFiles[0]['@microsoft.graph.downloadUrl']);
  //   window.performance.measure('OneDriveDownload', 'OneDriveDownloadStart');

  //   if (response.ok) {
  //     const json = await response.json();
  //     return json.parse() as RootState;
  //   } else {
  //     throw new Error('Fetch failure: ' + response.statusText);
  //   }
  // } else {
  //   return {};
  // }
}

export async function saveDataToOneDrive(accessToken: string, data: RootState): Promise<void> {
  const matchingFiles = await findFiles(accessToken, 'PersonalLog.txt');
  // TODO: implement save logic
}
