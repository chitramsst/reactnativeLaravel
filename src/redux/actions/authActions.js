import { LOGIN_SUCCESS, LOGOUT } from '../types';
import { api, API_URL } from "../../config/api"; 
import Toast from 'react-native-toast-message';


export const login = (email, password) => async (dispatch) => {
  try {
    console.log('Login request:', `${API_URL}/login`);

    const response = await api.post("/login", { email, password }); 

    if (response.data.token) {
      dispatch({
        type: LOGIN_SUCCESS,
        payload: { user: response.data.user, token: response.data.token },
      });
      Toast.show({
        type: "success",
        text1: "Logged In",
        text2: "Welcome to our world..!",
      });
    }
  } catch (error) {
    let msg = error.response?.data?.message || error.message || "Network error";
    Toast.show({
      type: "error", 
      text1: "Login Failed",
      text2: msg,
    });
    // console.error(
    //   'Login failed:',
    //   error.response?.data || error.message || 'Network error'
    // );
  }
};



export const logout = () => async (dispatch) => {
  try {
    dispatch({ type: LOGOUT });
    Toast.show({
      type: "success",
      text1: "Logged Out",
      text2: "You have successfully logged out!",
    });
  } catch (error) {
    console.error('Logout failed:', error.response?.data || error.message);
  }
};
