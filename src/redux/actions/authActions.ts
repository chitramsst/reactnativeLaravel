import { api, API_URL } from "../../config/api.js"; 
import Toast from 'react-native-toast-message';
import { AuthActionTypes } from '../../types/types.ts';
import { Dispatch } from 'redux';
import { AxiosError } from "axios";


export const login = (email : String, password: String ) => async (dispatch : Dispatch) => {
  try {
    console.log('Login request:', `${API_URL}/login`);

    const response = await api.post("/login", { email, password }); 

    if (response.data.token) {
      dispatch({
        type: AuthActionTypes.LOGIN_SUCCESS,
        payload: { user: response.data.user, token: response.data.token },
      });
      Toast.show({
        type: "success",
        text1: "Logged In",
        text2: "Welcome to our world..!",
      });
    }
  } catch (error : unknown) {
    if (error instanceof Error) {
    let msg = error.message || "Unknown Error";
    Toast.show({
      type: "error", 
      text1: "Login Failed",
      text2: msg,
    });
  }
    // console.error(
    //   'Login failed:',
    //   error.response?.data || error.message || 'Network error'
    // );
  }
};



export const logout = () => async (dispatch: Dispatch) => {
  try {
    dispatch({ type: AuthActionTypes.LOGOUT });
    Toast.show({
      type: "success",
      text1: "Logged Out",
      text2: "You have successfully logged out!",
    });
  } catch (error : unknown) {

    if (error instanceof Error) {
      Toast.show({
        type: "Logout Failed",
        text1: "Logged Out Failure ",
        text2: error.message
      });
    } else {
      Toast.show({
        type: "Logout Failed",
        text1: "Logged Out Failure ",
        text2: "Unknown Error"
      });
    }
  }
};
