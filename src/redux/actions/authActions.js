import { LOGIN_SUCCESS, LOGOUT } from '../types';
import { api, API_URL } from "../../config/api"; 


export const login = (email, password) => async (dispatch) => {
  try {
    console.log('Login request:', `${API_URL}/login`);

    const response = await api.post("/login", { email, password }); 

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



export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT });
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
  }
};
