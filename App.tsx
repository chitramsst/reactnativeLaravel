import React from 'react';
import { Provider, useSelector } from 'react-redux';
import store from './redux/store';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './screens/LoginScreen';
import DashboardScreen from './screens/DashboardScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  const { isAuthenticated } = useSelector(state => state.auth);

  return (
    <Stack.Navigator initialRouteName={isAuthenticated ? 'Dashboard' : 'Login'}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
    </Stack.Navigator>
  );
};

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <AppNavigator />
      </NavigationContainer>
    </Provider>
  );
}
