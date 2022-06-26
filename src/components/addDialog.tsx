import * as React from 'react';
import { IV1Entry } from '../dataLayer/v1/schema';
import { EditDialog } from './editDialog';

export interface IAddDialogProps {
  entry: IV1Entry;
  requestClose: () => void;
}

export function AddItemDialog(props: IAddDialogProps) {
  return <EditDialog onClose={props.requestClose} initialMode="edit" entry={props.entry}></EditDialog>;
}
