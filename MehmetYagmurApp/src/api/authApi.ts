import { ApiService, MICROSERVICES } from './client';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  username: string;
  fullName: string;
}

export interface AuthResponse {
  success: boolean;
  data: {
    user: {
      id: string;
      email: string;
      username: string;
      fullName: string;
      avatar?: string;
    };
    token: string;
    refreshToken: string;
  };
  message: string;
}

export class AuthApi {
  // Giriş yapma
  static async login(credentials: LoginRequest): Promise<AuthResponse> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/login`, credentials);
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  // Kayıt olma
  static async register(userData: RegisterRequest): Promise<AuthResponse> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/register`, userData);
      return response;
    } catch (error) {
      console.error('Register error:', error);
      throw error;
    }
  }

  // Çıkış yapma
  static async logout(): Promise<{ success: boolean; message: string }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/logout`);
      return response;
    } catch (error) {
      console.error('Logout error:', error);
      throw error;
    }
  }

  // Token yenileme
  static async refreshToken(refreshToken: string): Promise<AuthResponse> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/refresh`, {
        refreshToken,
      });
      return response;
    } catch (error) {
      console.error('Refresh token error:', error);
      throw error;
    }
  }

  // Şifre sıfırlama isteği
  static async forgotPassword(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/forgot-password`, {
        email,
      });
      return response;
    } catch (error) {
      console.error('Forgot password error:', error);
      throw error;
    }
  }

  // Şifre sıfırlama
  static async resetPassword(token: string, newPassword: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/reset-password`, {
        token,
        newPassword,
      });
      return response;
    } catch (error) {
      console.error('Reset password error:', error);
      throw error;
    }
  }

  // Email doğrulama
  static async verifyEmail(token: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/verify-email`, {
        token,
      });
      return response;
    } catch (error) {
      console.error('Verify email error:', error);
      throw error;
    }
  }

  // Email doğrulama kodu gönderme
  static async resendVerification(email: string): Promise<{ success: boolean; message: string }> {
    try {
      const response = await ApiService.post(`${MICROSERVICES.AUTH_SERVICE}/resend-verification`, {
        email,
      });
      return response;
    } catch (error) {
      console.error('Resend verification error:', error);
      throw error;
    }
  }

  // Token doğrulama
  static async validateToken(): Promise<{ valid: boolean; user?: any }> {
    try {
      const response = await ApiService.get(`${MICROSERVICES.AUTH_SERVICE}/validate`);
      return response;
    } catch (error) {
      console.error('Validate token error:', error);
      throw error;
    }
  }
}

export default AuthApi;