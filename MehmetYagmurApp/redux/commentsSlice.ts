import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Comment {
  id: string;
  text: string;
  userId: string;
}

interface CommentsState {
  comments: Comment[];
}

const initialState: CommentsState = {
  comments: [],
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    addComment: (state, action: PayloadAction<Comment>) => {
      state.comments.push(action.payload);
    },
    removeComment: (state, action: PayloadAction<string>) => {
      state.comments = state.comments.filter(comment => comment.id !== action.payload);
    },
    setComments: (state, action: PayloadAction<Comment[]>) => {
      state.comments = action.payload;
    },
  },
});

export const { addComment, removeComment, setComments } = commentsSlice.actions;
export default commentsSlice.reducer;