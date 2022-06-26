import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { IV1Entry } from '../dataLayer/v1/schema';

export interface IEditDialogProps {
  onClose: () => void;
  onPrevious?: () => void;
  previousEnabled?: boolean;
  onNext?: () => void;
  nextEnabled?: boolean;
  initialMode: Mode;
  entry: IV1Entry;
}

type Mode = 'view' | 'edit';

export function EditDialog(props: IEditDialogProps) {
  const dataLayer = useDataLayerContext();
  const [isDeleteConfirmationShown, setIsDeleteConfirmationShown] = React.useState<boolean>(false);
  const [mode, setMode] = React.useState<Mode>(props.initialMode);

  function onDeleteClick() {
    setIsDeleteConfirmationShown(true);
  }

  function confirmDelete() {
    setIsDeleteConfirmationShown(false);
    dataLayer.deleteEntry(props.entry);
    props.onClose();
  }

  function cancelDelete() {
    setIsDeleteConfirmationShown(false);
  }

  return (
    <div className="dialogRoot">
      <div className="dialogContents">
        <div className="editHeader">
          <div className="editHeaderLeft">
            <button onClick={onDeleteClick}>Delete</button>
          </div>
          <div className="editHeaderRight">
            <button onClick={props.onPrevious} disabled={!props.previousEnabled}>
              Prev
            </button>
            <button onClick={props.onNext} disabled={!props.nextEnabled}>
              Next
            </button>
            <button onClick={props.onClose}>X</button>
          </div>
        </div>
        <div className="entryHeader">
          <div className="entryDate">{new Date(props.entry.date).toDateString()}</div>
        </div>
        <div className="entryBodyRoot">
          {isDeleteConfirmationShown ? (
            <div className="deleteConfirmationRoot">
              Are you sure you want to delete this entry?
              <div className="buttonPair">
                <button onClick={confirmDelete}>Yes</button>
                <button onClick={cancelDelete}>No</button>
              </div>
            </div>
          ) : (
            <div className="entryBody">{props.entry.body}</div>
          )}
        </div>
      </div>
    </div>
  );
}
