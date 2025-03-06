import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from '../../redux/actions/authActions';
import { Alert } from "react-native";
import LogoutModal from "../components/Modals/LogoutModal";
import {designBottomBarColor, primaryColor, secondaryColor} from '../../utils/globalStyle'

// Screens
import LoginScreen from "../LoginScreen";
import DashboardScreen from "../DashboardScreen";
import HomeScreen from "../HomeScreen";
import ExpenseScreen from "../expense/ExpenseScreen";
import ExpenseCategoryScreen from "../expense/ExpenseCategoryScreen";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 👉 Stack Navigator for Screens inside Dashboard
const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="DashboardMain" component={DashboardScreen} />
      <Stack.Screen name="ExpenseCategory" component={ExpenseCategoryScreen} />
    </Stack.Navigator>
  );
};

const DashboardTabNavigator = () => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const dispatch = useDispatch();

  // Function to handle logout confirmation
  const handleLogout = () => {
    Alert.alert(
      "Confirm Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", onPress: () => dispatch(logout()), style: "default" },
      ],
      { cancelable: true }
    );
  };

  return (
    <>
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
          tabBarActiveTintColor: primaryColor,
          tabBarInactiveTintColor: secondaryColor,
          tabBarStyle: {
            backgroundColor: designBottomBarColor,
            height: 80,
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            alignItems: "center",
            justifyContent: "center",
            paddingBottom: 15,
            paddingTop: 10,
            borderTopWidth: 0,

            // ✅ Correct Shadow Properties
            shadowColor: "#000", // Darker shadow for visibility
            shadowOffset: { width: 0, height: 5 }, // Move shadow downward
            shadowOpacity: 0.3, // Adjust opacity
            shadowRadius: 10, // Spread the shadow

            // ✅ Android-specific shadow
            elevation: 10,
          },
          headerShown: false,
        })}
      >
        {/* 👇 DashboardStackNavigator keeps bottom bar visible on ExpenseCategory */}
        <Tab.Screen name="Dashboard" component={DashboardStackNavigator} />
        <Tab.Screen name="Expenses" component={ExpenseScreen} />
        <Tab.Screen
          name="Logout"
          component={HomeScreen}
          listeners={{
            tabPress: (e) => {
              e.preventDefault();
              setLogoutVisible(true);
            },
          }}
        />
      </Tab.Navigator>

      {/* Logout Modal */}
      <LogoutModal visible={isLogoutVisible} onClose={() => setLogoutVisible(false)} />
    </>
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
