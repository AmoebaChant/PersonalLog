import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { DataLoadingState } from './main';

export interface IMenuProps {
  dataLoadingState: DataLoadingState;
}

export function Menu(props: IMenuProps) {
  const dataLayer = useDataLayerContext();
  return (
    <div className="menuRoot">
      <div className="logo">PL</div>
      <div className="loadingState">
        [<span className="loadingStateText">{props.dataLoadingState}</span>]
      </div>
      <button onClick={() => dataLayer.createNewBlankEntry()}>+</button>
    </div>
  );
}
