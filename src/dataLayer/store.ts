import { configureStore } from '@reduxjs/toolkit';
import entriesReducer from './entriesSlice';

const LOCAL_STORAGE_KEY = 'DataModel';

export const store = configureStore({
  reducer: {
    entries: entriesReducer
  }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
