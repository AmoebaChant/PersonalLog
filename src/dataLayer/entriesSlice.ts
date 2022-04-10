import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import type { RootState } from './store';

export interface IEntry {
  id: string;
  name: string;
}

// Define a type for the slice state
interface IEntriesState {
  entries: IEntry[];
}

// Define the initial state using that type
const initialState: IEntriesState = {
  entries: []
};

export const entriesSlice = createSlice({
  name: 'entries',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    // Use the PayloadAction type to declare the contents of `action.payload`
    addEntry: (state, action: PayloadAction<IEntry>) => {
      state.entries.push(action.payload);
    },

    // Use the PayloadAction type to declare the contents of `action.payload`
    removeEntry: (state, action: PayloadAction<string>) => {
      state.entries.filter((entry) => {
        entry.name !== action.payload;
      });
    }
  }
});

export const { addEntry, removeEntry } = entriesSlice.actions;

// Other code such as selectors can use the imported `RootState` type
export const selectEntries = (state: RootState) => state.entries.entries;

export default entriesSlice.reducer;
