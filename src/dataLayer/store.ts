import { configureStore } from '@reduxjs/toolkit';
import entriesReducer, { IEntriesState } from './entriesSlice';
import { loadStateFromLocalStorage } from './persistentStorage';

export const store = configureStore({
  reducer: {
    entries: entriesReducer
  },
  preloadedState: loadStateFromLocalStorage()
});

export type RootState = {
  entries?: IEntriesState;
};
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
