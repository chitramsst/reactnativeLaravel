import axios from 'axios';
import { LOGIN_SUCCESS, LOGOUT } from '../types';

const API_URL =
  Platform.OS === 'android' ? 'http://10.0.2.2:8000/api' : 'http://127.0.0.1:8000/api';

// Login Action
export const login = (email, password) => async (dispatch) => {
 // console.log('Login Successful:', `${API_URL}/login`);
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login Successful:', response.data);

    if (response.data.token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response.data.user, token: response.data.token },
      });
    }
  } catch (error) {
    console.error(
      'Login failed:',
      error.response?.data || error.message || 'Network error'
    );
  }
};

// Logout Action
export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
  }
};
