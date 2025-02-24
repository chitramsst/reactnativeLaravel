import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./reducers/authReducer";
import thunk from "redux-thunk";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage"; // Correct storage for React Native

// Persist Configuration
const persistConfig = {
  key: "root",
  storage: AsyncStorage, // Use AsyncStorage for React Native
  whitelist: ["auth"], // Persist only auth state
};

// Persisted Reducer
const persistedReducer = persistReducer(persistConfig, authReducer);

// Configure Store
const store = configureStore({
  reducer: {
    auth: persistedReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Disable warnings for non-serializable data
      immutableCheck: false, // Disable immutable state checks if needed
    }), // ✅ Ensure thunk is added correctly
});

// Persistor
const persistor = persistStore(store);

export { store, persistor };
