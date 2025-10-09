import axios from 'axios';

// API Base URL - Production'da gerçek URL olacak
const API_BASE_URL = __DEV__ 
  ? 'http://localhost:3000' // Development
  : 'https://api.mehmetyagmur.app'; // Production

// Axios instance oluşturma
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Token ekleme
apiClient.interceptors.request.use(
  (config) => {
    // AsyncStorage'dan token al
    // const token = await AsyncStorage.getItem('authToken');
    // if (token) {
    //   config.headers.Authorization = `Bearer ${token}`;
    // }
    
    console.log('API Request:', config.method?.toUpperCase(), config.url);
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor - Error handling
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url);
    return response;
  },
  (error) => {
    console.error('Response Error:', error.response?.status, error.response?.data);
    
    // Token expired handling
    if (error.response?.status === 401) {
      // AsyncStorage.removeItem('authToken');
      // Navigation.navigate('Login');
    }
    
    // Network error handling
    if (!error.response) {
      console.error('Network Error:', error.message);
    }
    
    return Promise.reject(error);
  }
);

// API Service Classes
export class ApiService {
  static async get(url: string, params?: any) {
    const response = await apiClient.get(url, { params });
    return response.data;
  }

  static async post(url: string, data?: any) {
    const response = await apiClient.post(url, data);
    return response.data;
  }

  static async put(url: string, data?: any) {
    const response = await apiClient.put(url, data);
    return response.data;
  }

  static async delete(url: string) {
    const response = await apiClient.delete(url);
    return response.data;
  }

  static async upload(url: string, formData: FormData) {
    const response = await apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }
}

// Mikroservis URL'leri
export const MICROSERVICES = {
  API_GATEWAY: `${API_BASE_URL}`,
  AUTH_SERVICE: `${API_BASE_URL}/auth`,
  USER_SERVICE: `${API_BASE_URL}/users`,
  POST_SERVICE: `${API_BASE_URL}/posts`,
  FEED_SERVICE: `${API_BASE_URL}/feed`,
  MEDIA_SERVICE: `${API_BASE_URL}/media`,
  NOTIFICATION_SERVICE: `${API_BASE_URL}/notifications`,
};

export default apiClient;