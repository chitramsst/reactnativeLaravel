import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import thunk from 'redux-thunk';

const store = configureStore({
  reducer: {
    auth: authReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(), // Redux Thunk is included by default
});

export default store;