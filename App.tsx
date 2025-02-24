import React from "react";
import { Provider } from "react-redux";
import { store, persistor } from "./src/redux/store.js"; // ✅ Make sure both are imported correctly
import AppNavigator from "./src/screens/navigation/Navigator";
import { PersistGate } from "redux-persist/integration/react";

const App = () => {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <AppNavigator />
      </PersistGate>
    </Provider>
  );
};

export default App;