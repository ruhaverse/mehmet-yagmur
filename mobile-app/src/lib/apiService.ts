import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000'; // Backend API URL

export const fetchData = async (endpoint: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}${endpoint}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching data:', error);
    throw error;
  }
};