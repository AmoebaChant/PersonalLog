import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { IV1Entry } from '../dataLayer/v1/schema';

export interface IEditDialogProps {
  entries: IV1Entry[];
  initialIndex: number;
  requestClose: () => void;
}

export function EditDialog(props: IEditDialogProps) {
  const dataLayer = useDataLayerContext();
  const [indexToUse, setIndexToUse] = React.useState(props.initialIndex);
  const [isDeleteConfirmationShown, setIsDeleteConfirmationShown] = React.useState<boolean>(false);

  function onCloseClick() {
    props.requestClose();
  }

  function onDeleteClick() {
    setIsDeleteConfirmationShown(true);
  }

  function confirmDelete() {
    setIsDeleteConfirmationShown(false);
    dataLayer.deleteEntry(props.entries[indexToUse]);
    props.requestClose();
  }

  function cancelDelete() {
    setIsDeleteConfirmationShown(false);
  }

  function onPrevClick() {
    setIndexToUse((prev) => prev - 1);
  }

  function onNextClick() {
    setIndexToUse((prev) => prev + 1);
  }

  return (
    <div className="dialogRoot">
      <div className="dialogContents">
        <div className="editHeader">
          <div className="editHeaderLeft">
            <button onClick={onDeleteClick}>Delete</button>
          </div>
          <div className="editHeaderRight">
            <button onClick={onPrevClick} disabled={indexToUse === 0}>
              Prev
            </button>
            <button onClick={onNextClick} disabled={indexToUse === props.entries.length - 1}>
              Next
            </button>
            <button onClick={onCloseClick}>X</button>
          </div>
        </div>
        <div className="entryHeader">
          <div className="entryDate">{new Date(props.entries[indexToUse].date).toDateString()}</div>
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
            <div className="entryBody">{props.entries[indexToUse].body}</div>
          )}
        </div>
      </div>
    </div>
  );
}
