import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice';
import commentsReducer from './commentsSlice';
import postsReducer from './postsSlice';

export const store = configureStore({
  reducer: {
    user: userReducer,
    comments: commentsReducer,
    posts: postsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;