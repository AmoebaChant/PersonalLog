import { configureStore } from '@reduxjs/toolkit';
import entriesReducer, { IEntry } from './entriesSlice';
import { loadStateFromLocalStorage } from './persistentStorage';

export const store = configureStore({
  reducer: {
    entries: entriesReducer
  },
  preloadedState: loadStateFromLocalStorage()
});

export type RootState = {
  entries?: {
    entries: IEntry[];
  };
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
