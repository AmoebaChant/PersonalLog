import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootStateV1 } from './store';

export interface IEntry {
  id: string;
  name: string;
}

// Define a type for the slice state
export interface IEntriesState {
  entries: IEntry[];
  changeNumber: number;
  isDirty: boolean;
}

// Define the initial state using that type
export const entriesInitialState: IEntriesState = {
  entries: [],
  changeNumber: 0,
  isDirty: false
};

export const entriesSlice = createSlice({
  name: 'entries',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState: entriesInitialState,
  reducers: {
    // Used to load all of the entries
    loadAllEntries: (state, action: PayloadAction<IEntriesState | undefined>) => {
      if (action.payload) {
        state.entries = action.payload.entries;
        state.isDirty = false;
        state.changeNumber = 0;
      }
    },

    // Use the PayloadAction type to declare the contents of `action.payload`
    addEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries.push(action.payload);
      state.isDirty = true;
      state.changeNumber++;
    },

    // Use the PayloadAction type to declare the contents of `action.payload`
    removeEntry: (state, action: PayloadAction<string>) => {
      const index = state.entries.findIndex((entry) => entry.id === action.payload);

      if (index >= 0) {
        state.entries.splice(index, 1);
        state.isDirty = true;
        state.changeNumber++;
      }
    },

    setIsDirty: (state, action: PayloadAction<boolean>) => {
      state.isDirty = action.payload;
    }
  }
});

export const { loadAllEntries, addEntry, removeEntry, setIsDirty } = entriesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEntries = (state: RootStateV1) => state.entries.entries;
export const selectIsDirty = (state: RootStateV1) => state.entries.isDirty;

export default entriesSlice.reducer;
