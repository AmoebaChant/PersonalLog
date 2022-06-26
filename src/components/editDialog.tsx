import * as React from 'react';
import { useDataLayerContext } from '../dataLayer/dataLayerContext';
import { useObservable } from '../dataLayer/observable/useObservable';
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
type Dialog = 'none' | 'deleteConfirmation' | 'cancelConfirmation' | 'invalidDate';

function dateToString(newString: string, backupString: string): string {
  const value = Date.parse(newString);
  if (value === NaN) {
    return backupString;
  } else {
    return new Date(value).toDateString();
  }
}

export function EditDialog(props: IEditDialogProps) {
  const dataLayer = useDataLayerContext();
  const [dialogMode, setDialogMode] = React.useState<Dialog>('none');
  const [mode, setMode] = React.useState<Mode>(props.initialMode);
  const [tempDate, setTempDate] = React.useState<string>(new Date(props.entry.date.value).toDateString());
  const [tempBody, setTempBody] = React.useState<string>(props.entry.body.value);
  const date = useObservable(props.entry.date);
  const body = useObservable(props.entry.body);

  function onDelete() {
    setDialogMode('deleteConfirmation');
  }

  function onConfirmDelete() {
    setDialogMode('none');
    dataLayer.deleteEntry(props.entry);
    props.onClose();
  }

  function onCancelDelete() {
    setDialogMode('none');
  }

  function onEdit() {
    setMode('edit');
  }

  function onSave() {
    // Check date
    const val = Date.parse(tempDate);
    if (isNaN(val)) {
      setDialogMode('invalidDate');
      return;
    } else {
      // Save to the model
      props.entry.body.value = tempBody;
      props.entry.date.value = tempDate;
    }
    setMode('view');
    setDialogMode('none');
  }

  function onConfirmDiscard() {
    props.onClose();
  }

  function onCancelDiscard() {
    setDialogMode('none');
  }

  function onCloseRequested() {
    if (mode === 'edit') {
      setDialogMode('cancelConfirmation');
    } else {
      props.onClose();
    }
  }

  function onDateChange(event: React.ChangeEvent<HTMLInputElement>) {
    setTempDate(event.target.value);
  }

  function onBodyChange(event: React.ChangeEvent<HTMLTextAreaElement>) {
    setTempBody(event.target.value);
  }

  let bodyArea: JSX.Element;
  switch (dialogMode) {
    case 'deleteConfirmation':
      {
        bodyArea = (
          <div className="deleteConfirmationRoot">
            Are you sure you want to delete this entry?
            <div className="buttonPair">
              <button onClick={onConfirmDelete}>Yes</button>
              <button onClick={onCancelDelete}>No</button>
            </div>
          </div>
        );
      }
      break;
    case 'cancelConfirmation':
      {
        bodyArea = (
          <div className="deleteConfirmationRoot">
            Discard changes?
            <div className="buttonPair">
              <button onClick={onConfirmDiscard}>Yes</button>
              <button onClick={onCancelDiscard}>No</button>
            </div>
          </div>
        );
      }
      break;
    case 'invalidDate':
      {
        bodyArea = (
          <div className="deleteConfirmationRoot">
            That isn't a valid date, please fix and then save again.
            <div className="buttonPair">
              <button onClick={onSave}>Save</button>
            </div>
          </div>
        );
      }
      break;
    default: {
      bodyArea =
        mode === 'edit' ? (
          <textarea className="entryBodyEdit" value={tempBody} onChange={onBodyChange}></textarea>
        ) : (
          <div className="entryBody">{body}</div>
        );
    }
  }
  return (
    <div className="dialogRoot">
      <div className="dialogContents">
        <div className="editHeader">
          <div className="editHeaderLeft">
            {mode === 'edit' ? <button onClick={onSave}>Save</button> : <></>}
            {mode !== 'edit' ? <button onClick={onEdit}>Edit</button> : <></>}
            {mode !== 'edit' ? <button onClick={onDelete}>Delete</button> : <></>}
          </div>
          <div className="editHeaderRight">
            {mode !== 'edit' ? (
              <button onClick={props.onPrevious} disabled={!props.previousEnabled}>
                Prev
              </button>
            ) : (
              <></>
            )}
            {mode !== 'edit' ? (
              <button onClick={props.onNext} disabled={!props.nextEnabled}>
                Next
              </button>
            ) : (
              <></>
            )}
            <button onClick={onCloseRequested}>X</button>
          </div>
        </div>
        <div className="entryHeader">
          {mode === 'edit' ? (
            <input className="entryDateEdit" type="text" value={tempDate} onChange={onDateChange}></input>
          ) : (
            <div className="entryDate">{new Date(date).toDateString()}</div>
          )}
        </div>
        <div className="entryBodyRoot">{bodyArea}</div>
      </div>
    </div>
  );
}
