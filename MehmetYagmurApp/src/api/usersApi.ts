import { ApiService, MICROSERVICES } from './client';

// User interfaces
interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar?: string;
  bio?: string;
  followers: number;
  following: number;
  posts: number;
  isFollowing?: boolean;
  createdAt: string;
}

interface UpdateProfileData {
  fullName?: string;
  bio?: string;
  avatar?: string;
}

// Users API servis
export class UsersApi {
  // Kullanıcı profili getirme
  static async getProfile(userId?: string): Promise<User> {
    try {
      const url = userId 
        ? `${MICROSERVICES.USER_SERVICE}/${userId}`
        : `${MICROSERVICES.USER_SERVICE}/me`;
      
      const response = await ApiService.get(url);
      return response;
    } catch (error) {
      console.error('Get profile error:', error);
      throw new Error('Profil bilgileri yüklenemedi.');
    }
  }

  // Profil güncelleme
  static async updateProfile(data: UpdateProfileData): Promise<User> {
    try {
      const response = await ApiService.put(`${MICROSERVICES.USER_SERVICE}/me`, data);
      return response;
    } catch (error) {
      console.error('Update profile error:', error);
      throw new Error('Profil güncellenemedi.');
    }
  }

  // Kullanıcı arama
  static async searchUsers(query: string, page: number = 1, limit: number = 10): Promise<{
    users: User[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.USER_SERVICE}/search`, {
        q: query,
        page,
        limit,
      });
      return response;
    } catch (error) {
      console.error('Search users error:', error);
      throw new Error('Kullanıcı araması gerçekleştirilemedi.');
    }
  }

  // Kullanıcıyı takip etme/etmeme
  static async toggleFollow(userId: string): Promise<{ 
    success: boolean; 
    isFollowing: boolean; 
    followers: number; 
  }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.USER_SERVICE}/${userId}/follow`);
      return response;
    } catch (error) {
      console.error('Toggle follow error:', error);
      throw new Error('Takip işlemi gerçekleştirilemedi.');
    }
  }

  // Takipçileri getirme
  static async getFollowers(userId: string, page: number = 1, limit: number = 20): Promise<{
    users: User[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.USER_SERVICE}/${userId}/followers`, {
        page,
        limit,
      });
      return response;
    } catch (error) {
      console.error('Get followers error:', error);
      throw new Error('Takipçiler yüklenemedi.');
    }
  }

  // Takip edilenleri getirme
  static async getFollowing(userId: string, page: number = 1, limit: number = 20): Promise<{
    users: User[];
    hasMore: boolean;
    total: number;
  }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.USER_SERVICE}/${userId}/following`, {
        page,
        limit,
      });
      return response;
    } catch (error) {
      console.error('Get following error:', error);
      throw new Error('Takip edilenler yüklenemedi.');
    }
  }

  // Avatar yükleme
  static async uploadAvatar(formData: FormData): Promise<{ avatarUrl: string }> {
    try {
      const response = await ApiService.upload(`${MICROSERVICES.MEDIA_SERVICE}/avatar`, formData);
      return response;
    } catch (error) {
      console.error('Upload avatar error:', error);
      throw new Error('Avatar yüklenemedi.');
    }
  }

  // Hesap silme
  static async deleteAccount(): Promise<{ success: boolean }> {
    try {
      const response = await ApiService.delete(`${MICROSERVICES.USER_SERVICE}/me`);
      return response;
    } catch (error) {
      console.error('Delete account error:', error);
      throw new Error('Hesap silinemedi.');
    }
  }

  // Şifre değiştirme
  static async changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean }> {
    try {
      const response = await ApiService.put(`${MICROSERVICES.USER_SERVICE}/me/password`, {
        currentPassword,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Change password error:', error);
      throw new Error('Şifre değiştirilemedi.');
    }
  }
}

export default UsersApi;