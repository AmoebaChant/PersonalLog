import * as React from 'react';
import { dataLayer, useDataLayerContext } from '../dataLayer/dataLayerContext';

export function AddDialog() {
  const [date, setDate] = React.useState<string>(Date);
  const [body, setBody] = React.useState<string>('');
  const useDataLayer = useDataLayerContext();

  return (
    <div className="addDialog">
      <div className="addLabel">
        <input type="text" className="addDate" value={date} onChange={(event) => setDate(event.target.value)}></input>
      </div>
      <div className="addLabel">
        <input type="text" className="addBody" value={body} onChange={(event) => setBody(event.target.value)}></input>
      </div>
      <button onClick={() => dataLayer.createNewBlankEntry()}>Add</button>
    </div>
  );
}
