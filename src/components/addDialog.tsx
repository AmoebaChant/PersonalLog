import * as React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEntry, IV1Entry, removeEntry, selectEntries } from '../dataLayer/entriesSlice';
import { v4 as uuidv4 } from 'uuid';

export function AddDialog() {
  const [date, setDate] = React.useState<string>(Date);
  const dispatch = useDispatch();

  return (
    <div className="addDialog">
      <div className="addLabel">
        <input type="text" className="addDate" value={date} onChange={(value) => setDate(value)}></input>
      </div>
      <div className="addLabel">
        <input type="text" className="addBody" value={body} onChange={(value) => setBody(value)}></input>
      </div>
      <button onClick={() => dispatch(addEntry({ id: uuidv4(), date: new Date(Date.now()).toISOString(), body: 'New entry' }))}>Add</button>
    </div>
  );
}
