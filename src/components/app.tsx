import * as React from 'react';
import { Auth } from '../dataLayer/auth';
import { useObservable } from '../dataLayer/observable/useObservable';
import { Session } from './session';
import { NotLoggedInMain } from './notLoggedInMain';

export interface IAppProps {
  auth: Auth;
}
export function App(props: IAppProps) {
  const loginPhase = useObservable(props.auth.loginPhase);
  return loginPhase === 'loggedIn' ? <Session auth={props.auth} /> : <NotLoggedInMain auth={props.auth} />;
}
