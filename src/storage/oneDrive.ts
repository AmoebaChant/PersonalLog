import * as graph from '@microsoft/microsoft-graph-client';

// TODO: don't recreate client each time
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

export async function getFileContents(accessToken: string, fileName: string): Promise<string | undefined> {
  const client = getAuthenticatedClient(accessToken);
  const fileQuery = await client.api('https://graph.microsoft.com/v1.0/me/drive/root:/' + fileName).get();
  const itemId = fileQuery.id;
  const downloadUrlResponse = await client
    .api('https://graph.microsoft.com/v1.0/me/drive/items/' + itemId + '?select=id,@microsoft.graph.downloadUrl')
    .get();
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

export async function writeToFile(accessToken: string, fileName: string, fileContents: string): Promise<void> {
  const client = getAuthenticatedClient(accessToken);
  const fileQuery = await client.api('https://graph.microsoft.com/v1.0/me/drive/root:/' + fileName).get();
  const itemId = fileQuery.id;
  await client.api('https://graph.microsoft.com/v1.0/me/drive/items/' + itemId + '/content').put(fileContents);
}

export async function writeNewFile(accessToken: string, pathAndFileName: string, fileContents: string): Promise<void> {
  const client = getAuthenticatedClient(accessToken);
  await client
    .api('https://graph.microsoft.com/v1.0/me/drive/root:/' + pathAndFileName + ':/content')
    .put(fileContents);
}
