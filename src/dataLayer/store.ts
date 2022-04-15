import { configureStore } from '@reduxjs/toolkit';
import entriesReducer, { entriesInitialState, IV1EntriesState } from './entriesSlice';

export type RootStateV1 = {
  entries?: IV1EntriesState;
};

export const defaultRootState: RootStateV1 = {
  entries: entriesInitialState
};

export const store = configureStore({
  reducer: {
    entries: entriesReducer
  },
  preloadedState: defaultRootState
});

// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;