import { ApiService, MICROSERVICES } from './client';

// Post interfaces
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

interface CreatePostData {
  text: string;
  images?: string[];
  videos?: string[];
  privacy?: 'public' | 'friends' | 'private';
}

// Posts API servis
export class PostsApi {
  // Gönderileri getirme (feed)
  static async getPosts(page: number = 1, limit: number = 10): Promise<{
    posts: Post[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.POST_SERVICE}`, {
        page,
        limit,
      });
      return response;
    } catch (error) {
      console.error('Get posts error:', error);
      throw new Error('Gönderiler yüklenemedi.');
    }
  }

  // Yeni gönderi oluşturma
  static async createPost(postData: CreatePostData): Promise<Post> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.POST_SERVICE}`, postData);
      return response;
    } catch (error) {
      console.error('Create post error:', error);
      throw new Error('Gönderi oluşturulamadı.');
    }
  }

  // Gönderiyi beğenme/beğenmeme
  static async toggleLike(postId: string): Promise<{ success: boolean; isLiked: boolean; likes: number }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.POST_SERVICE}/${postId}/like`);
      return response;
    } catch (error) {
      console.error('Toggle like error:', error);
      throw new Error('Beğeni işlemi gerçekleştirilemedi.');
    }
  }

  // Gönderiyi kaydetme/kaydetmeme
  static async toggleBookmark(postId: string): Promise<{ success: boolean; isBookmarked: boolean }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.POST_SERVICE}/${postId}/bookmark`);
      return response;
    } catch (error) {
      console.error('Toggle bookmark error:', error);
      throw new Error('Kaydetme işlemi gerçekleştirilemedi.');
    }
  }

  // Gönderiyi paylaşma
  static async sharePost(postId: string): Promise<{ success: boolean; shares: number }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.POST_SERVICE}/${postId}/share`);
      return response;
    } catch (error) {
      console.error('Share post error:', error);
      throw new Error('Paylaşım gerçekleştirilemedi.');
    }
  }

  // Gönderiyi silme
  static async deletePost(postId: string): Promise<{ success: boolean }> {
    try {
      const response = await ApiService.delete(`${MICROSERVICES.POST_SERVICE}/${postId}`);
      return response;
    } catch (error) {
      console.error('Delete post error:', error);
      throw new Error('Gönderi silinemedi.');
    }
  }

  // Kullanıcının gönderilerini getirme
  static async getUserPosts(userId: string, page: number = 1, limit: number = 10): Promise<{
    posts: Post[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.POST_SERVICE}/user/${userId}`, {
        page,
        limit,
      });
      return response;
    } catch (error) {
      console.error('Get user posts error:', error);
      throw new Error('Kullanıcı gönderileri yüklenemedi.');
    }
  }

  // Tek gönderi getirme
  static async getPost(postId: string): Promise<Post> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.POST_SERVICE}/${postId}`);
      return response;
    } catch (error) {
      console.error('Get post error:', error);
      throw new Error('Gönderi yüklenemedi.');
    }
  }

  // Medya yükleme
  static async uploadMedia(formData: FormData): Promise<{ urls: string[] }> {
    try {
      const response = await ApiService.upload(`${MICROSERVICES.MEDIA_SERVICE}/upload`, formData);
      return response;
    } catch (error) {
      console.error('Upload media error:', error);
      throw new Error('Medya yüklenemedi.');
    }
  }
}

export default PostsApi;