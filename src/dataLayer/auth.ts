import * as msal from '@azure/msal-browser';
import { normalizeError } from '../utilities/errors';
import { Observable } from './observable/observable';

// TODO: Refactor into a React provider with hooks

export type LoginPhase = 'start' | 'loginNeeded' | 'loggedIn' | 'error';

const config = {
  appId: '01d7c004-197e-4edd-8673-7f94000c4328',
  scopes: ['user.read', 'files.readwrite']
};

export class Auth {
  public readonly loginPhase: Observable<LoginPhase> = new Observable<LoginPhase>('start');
  public readonly error: Observable<any> = new Observable<any>(undefined);
  private _msalInstance: msal.PublicClientApplication;
  private _initializePromise: Promise<void>;

  constructor() {
    console.log('Creating PublicClientApplication');
    // Initialize the MSAL application object
    this._msalInstance = new msal.PublicClientApplication({
      auth: {
        clientId: config.appId
      },
      cache: {
        cacheLocation: 'localStorage',
        storeAuthStateInCookie: true
      }
    });

    this._initializePromise = this.initialize();
  }

  private initialize = async (): Promise<void> => {
    try {
      console.log('Calling handleRedirectPromise');
      const tokenResponse = await this._msalInstance.handleRedirectPromise();
      if (tokenResponse === null) {
        console.log('handleRedirectPromise null, we are not coming back from an auth redirect');
      } else {
        console.log('handleRedirectPromise not null, we are coming back from a successful auth redirect');
      }
      console.log(tokenResponse);
    } catch (error) {
      console.log('handleRedirectPromise threw an error');
      console.log(error);
    }
    this.checkIfLoggedIn();
  };

  private checkIfLoggedIn(): void {
    var accounts = this._msalInstance.getAllAccounts();
    this.loginPhase.value = accounts.length > 0 ? 'loggedIn' : 'loginNeeded';
    console.log('Checking if logged in - ' + this.loginPhase.value);
  }

  private ensureInitialized = (): Promise<void> => this._initializePromise;

  public login = async (): Promise<void> => {
    await this.ensureInitialized();

    try {
      console.log('Calling loginRedirect');
      await this._msalInstance.loginRedirect({
        scopes: config.scopes
      });
      console.log('loginRedirect returned');
      this.checkIfLoggedIn();
    } catch (err) {
      console.log('loginRedirect threw an error');
      console.log(err);
      this.error.value = normalizeError(err);
      this.loginPhase.value = 'error';
    }
  };

  public getAccessToken = async (): Promise<string | undefined> => {
    await this.ensureInitialized;

    try {
      // Get the access token silently
      // If the cache contains a non-expired token, this function
      // will just return the cached token. Otherwise, it will
      // make a request to the Azure OAuth endpoint to get a token
      console.log('GetAccessToken - Calling acquireTokenSilent');
      var accounts = this._msalInstance.getAllAccounts();
      var silentResult = await this._msalInstance.acquireTokenSilent({
        scopes: config.scopes,
        account: accounts[0]
      });

      console.log('GetAccessToken - acquireTokenSilent returned ok');
      console.log(silentResult);

      return silentResult.accessToken;
    } catch (error) {
      console.log('GetAccessToken - error');
      console.log(error);
      this.error.value = normalizeError(error);
      if (error instanceof msal.InteractionRequiredAuthError) {
        this._msalInstance.acquireTokenRedirect({
          scopes: config.scopes
        });
      }
      return undefined;
    }
  };
}
