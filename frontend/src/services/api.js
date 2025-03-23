import axios from 'axios';

const api = axios.create({
    baseURL: process.env.REACT_APP_API_BASE_URL, // Should be http://localhost:5001/api
    headers: {
      'Content-Type': 'application/json',
    }
  });

export default api;