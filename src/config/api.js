import axios from 'axios';
import { store } from '../redux/store'; // Ensure store is imported correctly
import { Platform } from 'react-native';

const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://127.0.0.1:8000/api';

// ✅ Create Axios instance
const api = axios.create({
  baseURL: API_URL,
});

// ✅ Attach token automatically (excluding login request)
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state?.auth?.token; // Ensure we safely get token

    if (token && config.url !== "/login") { // Exclude login request
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export { API_URL, api }; // ✅ Ensure api is exported properly
