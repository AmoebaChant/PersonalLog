import * as React from 'react';
import { Auth, LoginPhase } from '../dataLayer/auth';
import { useObservable } from '../dataLayer/observable/useObservable';

export interface INotLoggedInMain {
  auth: Auth;
}

export function NotLoggedInMain(props: INotLoggedInMain) {
  const loginPhase = useObservable(props.auth.loginPhase);

  return (
    <div className="notLoggedInRoot">
      <div className="notLoggedInPanel">
        <div className="appTitle">Personal Log</div>
        <div className="appSubtitle">
          A multi-platform logging app that supports hashtags, and stores all of the data in your own OneDrive account
          in human-readable form so you'll always be able to access it.
        </div>
        {loginPhase === 'loginNeeded' ? (
          <button className="loginButton" onClick={() => props.auth.login()}>
            Log in
          </button>
        ) : (
          <></>
        )}
      </div>
    </div>
  );
}
