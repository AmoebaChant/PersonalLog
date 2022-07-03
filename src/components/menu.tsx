import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useObservable } from '../dataLayer/observable/useObservable';
import { useFilterContext } from './filterContext';
import { DataLoadingState } from './main';

export interface IMenuProps {
  dataLoadingState: DataLoadingState;
  addItem: () => void;
}

export function Menu(props: IMenuProps) {
  const dataLayer = useDataLayerContext();
  const filter = useFilterContext();
  const filterTagsRequired = useObservable(filter.tagsRequired);

  return (
    <div className="menuRoot">
      <div className="logo">PL</div>
      <div className="loadingState">
        [<span className="loadingStateText">{getFriendlyText(props.dataLoadingState)}</span>]
      </div>
      <button onClick={props.addItem}>+</button>
      <div className="filterTagList">
        {filterTagsRequired.map((tagName) => (
          <span
            className="tag"
            style={{ borderColor: dataLayer.getTagColor(tagName) }}
            key={tagName}
            onClick={() => {
              filter.removeRequiredTag(tagName);
            }}
          >
            {tagName}
          </span>
        ))}
      </div>
    </div>
  );
}

function getFriendlyText(dataLoadingState: DataLoadingState): string {
  switch (dataLoadingState) {
    case 'none':
      return 'saved';
    default:
      return dataLoadingState;
  }
}
