import * as React from 'react';
import { Auth, LoginPhase } from '../dataLayer/auth';
import { LoggedInMain } from './loggedInMain';
import { NotLoggedInMain } from './notLoggedInMain';

export interface IAppProps {
  auth: Auth;
}
export function App(props: IAppProps) {
  const [loginPhase, setLoginPhase] = React.useState<LoginPhase>(props.auth.loginPhase.value);

  React.useEffect(() => {
    const unsubscribe = props.auth.loginPhase.subscribe(
      (newLoginPhase: LoginPhase) => {
        setLoginPhase(newLoginPhase);
      },
      { notifyWithCurrentValue: false }
    );

    return unsubscribe;
  }, [props.auth, setLoginPhase]);

  return loginPhase === 'loggedIn' ? <LoggedInMain auth={props.auth} /> : <NotLoggedInMain auth={props.auth} />;
}
