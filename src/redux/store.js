import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; 

const persistConfig = {
  key: "root",
  storage: AsyncStorage, 
  whitelist: ["auth"], 
};


const persistedReducer = persistReducer(persistConfig, authReducer);


const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
      immutableCheck: false, 
    }), 
});


const persistor = persistStore(store);

export { store, persistor };
