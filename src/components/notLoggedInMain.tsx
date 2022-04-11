import * as React from 'react';
import { store } from '../dataLayer/store';
import { List } from './list';
import { Menu } from './menu';
import { saveStateToLocalStorage } from '../dataLayer/persistentStorage';
import { Auth, LoginPhase } from '../dataLayer/auth';

export interface INotLoggedInMain {
  auth: Auth;
}

export function NotLoggedInMain(props: INotLoggedInMain) {
  const [loginPhase, setLoginPhase] = React.useState<LoginPhase>(props.auth.loginPhase.value);

  React.useEffect(() => {
    const unsubscribe = props.auth.loginPhase.subscribe((newLoginPhase: LoginPhase) => {
      setLoginPhase(newLoginPhase);
    });

    return unsubscribe;
  }, [props.auth, setLoginPhase]);

  return (
    <div>
      <div className="appTitle">Personal Log</div>
      <div className="loginState">{loginPhase}</div>
      {loginPhase === 'loginNeeded' ? <button onClick={() => props.auth.login()}>Log in</button> : <></>}
    </div>
  );
}
