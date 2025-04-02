export type RootStackParamList = {
    Expense: undefined; 
    ExpenseCategory : undefined;
    Reminder: undefined;
    Login: undefined;
    Dashboard: undefined;
    DashboardTab: undefined;
  };

  interface AuthState {
    isAuthenticated: boolean;
  }
  
  export interface RootState {
    auth: AuthState;
  }


  export enum AuthActionTypes {
    LOGIN_REQUEST = 'LOGIN_REQUEST',
    LOGIN_SUCCESS = 'LOGIN_SUCCESS',
    LOGIN_FAILURE = 'LOGIN_FAILURE',
    LOGOUT = 'LOGOUT',
  }
  
  interface LoginSuccessAction {
    type: AuthActionTypes.LOGIN_SUCCESS;
    payload: any; // Define this as per your response structure
  }
  
  interface LoginFailureAction {
    type: AuthActionTypes.LOGIN_FAILURE;
    payload: string;
  }

  interface LogoutAction {
    type: AuthActionTypes.LOGOUT;
    payload: any;
  }
  
  export type AuthActions = LoginSuccessAction | LoginFailureAction | LogoutAction;
