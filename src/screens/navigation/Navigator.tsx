import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from '../../redux/actions/authActions';
import { TouchableOpacity } from "react-native";

// Screens
import LoginScreen from "../LoginScreen";
import DashboardScreen from "../DashboardScreen";
import HomeScreen from "../HomeScreen";
import ExpenseScreen from "../ExpenseScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const DashboardTabNavigator = () => {
  const dispatch = useDispatch();

  return (
    <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ color, size }) => {
        let iconName;
        if (route.name === "Dashboard") {
          iconName = "grid-outline";
        } else if (route.name === "Expenses") {
          iconName = "wallet-outline";
        } else if (route.name === "Logout") {
          iconName = "log-out-outline";
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: "#8DBC30",
      tabBarInactiveTintColor: "gray",
      tabBarStyle: {
        backgroundColor: "white",
        height: 80, // Increased bottom bar height
        borderTopLeftRadius: 20, // Rounded top-left
        borderTopRightRadius: 20, // Rounded top-right
        position: "absolute", // Ensure it stays at the bottom
        left: 0,
        right: 0,
        bottom: 0,
        alignItems: "center", // Align icons in the center
        justifyContent: "center", // Center items
        paddingBottom: 15, // Adjust bottom padding for perfect centering
        paddingTop: 10, // Add padding at the top for even spacing
        borderTopWidth: 0, // Remove top border for smooth edges
      },
      headerShown: false,
    })}
  >
    <Tab.Screen name="Dashboard" component={DashboardScreen} />
    <Tab.Screen name="Expenses" component={ExpenseScreen} />
    <Tab.Screen
      name="Logout"
      component={HomeScreen} // Redirect to Home after logout
      listeners={{
        tabPress: (e) => {
          e.preventDefault(); // Prevent navigation
          dispatch(logout());
        },
      }}
    />
  </Tab.Navigator>
  
  );
};

const AppNavigator = () => {
  const { isAuthenticated } = useSelector((state) => state.auth);

  return (
    <NavigationContainer>
      {isAuthenticated ? (
        <DashboardTabNavigator />
      ) : (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

export default AppNavigator;
