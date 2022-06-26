import * as React from 'react';
import { Auth, LoginPhase } from '../dataLayer/auth';
import { useObservable } from '../dataLayer/observable/useObservable';

export interface INotLoggedInMain {
  auth: Auth;
}

export function NotLoggedInMain(props: INotLoggedInMain) {
  const loginPhase = useObservable(props.auth.loginPhase);

  return (
    <div>
      <div className="appTitle">Personal Log</div>
      <div className="loginState">{loginPhase}</div>
      {loginPhase === 'loginNeeded' ? <button onClick={() => props.auth.login()}>Log in</button> : <></>}
    </div>
  );
}
