import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Post {
  id: string;
  userId: string;
  username: string;
  userAvatar?: string;
  text: string;
  images?: string[];
  videos?: string[];
  createdAt: string;
  updatedAt: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
}

interface PostsState {
  posts: Post[];
  loading: boolean;
  error: string | null;
  hasMore: boolean;
  page: number;
}

const initialState: PostsState = {
  posts: [],
  loading: false,
  error: null,
  hasMore: true,
  page: 1,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    // Post yükleme
    fetchPostsStart: (state) => {
      state.loading = true;
      state.error = null;
    },
    fetchPostsSuccess: (state, action: PayloadAction<{ posts: Post[]; hasMore: boolean }>) => {
      state.loading = false;
      if (action.payload.posts.length === 0 || state.page === 1) {
        state.posts = action.payload.posts;
      } else {
        state.posts = [...state.posts, ...action.payload.posts];
      }
      state.hasMore = action.payload.hasMore;
      state.page += 1;
    },
    fetchPostsFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },

    // Yeni post ekleme
    addPost: (state, action: PayloadAction<Post>) => {
      state.posts.unshift(action.payload);
    },

    // Post güncelleme
    updatePost: (state, action: PayloadAction<{ id: string; updates: Partial<Post> }>) => {
      const index = state.posts.findIndex(post => post.id === action.payload.id);
      if (index !== -1) {
        state.posts[index] = { ...state.posts[index], ...action.payload.updates };
      }
    },

    // Post silme
    deletePost: (state, action: PayloadAction<string>) => {
      state.posts = state.posts.filter(post => post.id !== action.payload);
    },

    // Like/Unlike
    toggleLike: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.isLiked = !post.isLiked;
        post.likes += post.isLiked ? 1 : -1;
      }
    },

    // Bookmark/Unbookmark
    toggleBookmark: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.isBookmarked = !post.isBookmarked;
      }
    },

    // Share sayısı artırma
    incrementShare: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.shares += 1;
      }
    },

    // Comment sayısı artırma
    incrementComment: (state, action: PayloadAction<string>) => {
      const post = state.posts.find(post => post.id === action.payload);
      if (post) {
        post.comments += 1;
      }
    },

    // State sıfırlama
    resetPosts: (state) => {
      state.posts = [];
      state.page = 1;
      state.hasMore = true;
      state.error = null;
    },

    // Sayfa sıfırlama
    resetPage: (state) => {
      state.page = 1;
      state.hasMore = true;
    },
  },
});

export const {
  fetchPostsStart,
  fetchPostsSuccess,
  fetchPostsFailure,
  addPost,
  updatePost,
  deletePost,
  toggleLike,
  toggleBookmark,
  incrementShare,
  incrementComment,
  resetPosts,
  resetPage,
} = postsSlice.actions;

export default postsSlice.reducer;