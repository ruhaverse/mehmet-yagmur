import { useEffect } from 'react';
import { fetchData } from '../lib/apiService';

export default function HomePage() {
  useEffect(() => {
    const testAPI = async () => {
      try {
        const data = await fetchData('/test-endpoint');
        console.log('API Response:', data);
      } catch (error) {
        console.error('API Test Error:', error);
      }
    };

    testAPI();
  }, []);

  return (
    <div>
      <h1>Welcome to ShareUptime</h1>
      <p>Testing backend API integration...</p>
    </div>
  );
}