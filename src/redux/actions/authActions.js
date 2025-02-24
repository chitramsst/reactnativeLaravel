import axios from 'axios';
import { LOGIN_SUCCESS, LOGOUT } from '../types';
import API_URL from "../../config/api";


// Login Action
export const login = (email, password) => async (dispatch) => {
  console.log('Login Successful:', `${API_URL}/login`);
  try {
    const response = await axios.post(`${API_URL}/login`, { email, password });
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
