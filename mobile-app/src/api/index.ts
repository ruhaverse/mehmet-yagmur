// API Exports
export { default as ApiService } from './client';
export { MICROSERVICES } from './client';

// Auth API
export { AuthApi } from './authApi';

// Posts API
export { PostsApi } from './postsApi';

// Users API
export { UsersApi } from './usersApi';

// Convenience export for all APIs
import { AuthApi } from './authApi';
import { PostsApi } from './postsApi';
import { UsersApi } from './usersApi';

export const API = {
  Auth: AuthApi,
  Posts: PostsApi,
  Users: UsersApi,
};