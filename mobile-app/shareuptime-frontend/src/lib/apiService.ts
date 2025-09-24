import axios from 'axios';

const api = axios.create({
  baseURL: process.env.BACKEND_API_URL, // Backend API URL
});

export const fetchData = async (endpoint: string) => {
  try {
    const response = await api.get(endpoint);
    return response.data;
  } catch (error) {
    console.error('API fetch error:', error);
    throw error;
  }
};

export default api;