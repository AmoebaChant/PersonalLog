import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEntry, selectEntries } from '../dataLayer/entriesSlice';
import { v4 as uuidv4 } from 'uuid';
import { DataLoadingState } from './loggedInMain';

export interface IMenuProps {
  dataLoadingState: DataLoadingState;
}

export function Menu(props: IMenuProps) {
  const entries = useSelector(selectEntries);
  const dispatch = useDispatch();
  return (
    <div className="menuRoot">
      {props.dataLoadingState}
      <button onClick={() => dispatch(addEntry({ id: uuidv4(), date: new Date(Date.now()).toISOString(), body: 'New entry' }))}>Add</button>
    </div>
  );
}
