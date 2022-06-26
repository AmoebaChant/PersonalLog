import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { IV1Entry } from '../dataLayer/v1/schema';
import { EditDialog } from './editDialog';

export interface IEditDialogProps {
  entries: IV1Entry[];
  initialIndex: number;
  requestClose: () => void;
}

export function EditListItemDialog(props: IEditDialogProps) {
  const dataLayer = useDataLayerContext();
  const [indexToUse, setIndexToUse] = React.useState(props.initialIndex);

  function onPrevious() {
    setIndexToUse((prev) => prev - 1);
  }

  function onNext() {
    setIndexToUse((prev) => prev + 1);
  }

  return (
    <EditDialog
      onClose={props.requestClose}
      onPrevious={onPrevious}
      previousEnabled={indexToUse > 0}
      onNext={onNext}
      nextEnabled={indexToUse < props.entries.length - 1}
      initialMode="view"
      entry={props.entries[indexToUse]}
    ></EditDialog>
  );
}
