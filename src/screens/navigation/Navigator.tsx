import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import Ionicons from "react-native-vector-icons/Ionicons";
import { logout } from '../../redux/actions/authActions';
import { Alert, View, Animated, Text } from "react-native";
import LogoutModal from "../components/Modals/LogoutModal";
import {designBottomBarColor, primaryColor, secondaryColor} from '../../utils/globalStyle'
import Toast from "react-native-toast-message";

// Screens
import LoginScreen from "../LoginScreen";
import DashboardScreen from "../DashboardScreen";
import HomeScreen from "../HomeScreen";
import ExpenseScreen from "../expense/ExpenseScreen";
import ExpenseCategoryScreen from "../expense/ExpenseCategoryScreen";
import ReminderScreen from "../reminder/ReminderScreen";
import NotesScreen from "../notes/NotesScreen.tsx";
import {RootState} from '../../types/types.ts'


const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// 👉 Stack Navigator for Screens inside Dashboard
const DashboardStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Dashboard" component={DashboardScreen} />
      <Stack.Screen name="ExpenseCategory" component={ExpenseCategoryScreen} />
      <Stack.Screen name="Reminder" component={ReminderScreen} />
      <Stack.Screen name="Note" component={NotesScreen} />
    </Stack.Navigator>
  );
};

const DashboardTabNavigator = () => {
  const [isLogoutVisible, setLogoutVisible] = useState(false);
  const dispatch = useDispatch();

  // // Function to handle logout confirmation
  // const handleLogout = () => {
  //   Alert.alert(
  //     "Confirm Logout",
  //     "Are you sure you want to logout?",
  //     [
  //       { text: "Cancel", style: "cancel" },
  //       { text: "Logout", onPress: () => dispatch(logout()), style: "default" },
  //     ],
  //     { cancelable: true }
  //   );
  // };

  return (
    <>
<Tab.Navigator
  screenOptions={({ route }) => ({
    tabBarShowLabel: false, // ✅ Hides text labels
    tabBarIcon: ({ color, size, focused }) => {
      let iconName;
      if (route.name === "Dashboard") {
        iconName = "grid-outline";
      } else if (route.name === "Expenses") {
        iconName = "wallet-outline";
      } else if (route.name === "Logout") {
        iconName = "log-out-outline";
      }

      const animatedScale = new Animated.Value(focused ? 1.2 : 1);

      Animated.spring(animatedScale, {
        toValue: focused ? 1.3 : 1,
        friction: 5,
        useNativeDriver: true,
      }).start();

      return (
        <Animated.View
        style={{
          transform: [{ scale: animatedScale }], // ✅ Floating effect on select
          backgroundColor: focused ? "#ffadae" : "transparent", // ✅ Active tab color
          width: focused ? size * 3.5 : size * 2, // ✅ Wider when active
          height: 27, // ✅ Same as tab bar height
          alignItems: "center",
          justifyContent: "center",
          bottom: 0, // ✅ Align with tab bar bottom
          shadowColor: focused ? "#ffadae" : "#000", // ✅ Glow when active
          shadowOffset: { width: 0, height: 6 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          paddingHorizontal: focused ? 10 : 10, // ✅ Extra 20px padding when active
          paddingVertical: 1,
          flexDirection: focused ? "row" : "column", 
          borderRadius: 15,
        }}
        >
          <Ionicons
            name={iconName ?? 'home'}
            size={size/1.5} // ✅ Adjusted for perfect fit
            color={focused ? "#000" : color}
          /> 
           {focused && (
    <Text
      style={{
        color: "#221e23",
        fontSize: 7,
        marginLeft: 3, // ✅ Space between icon and text
        fontWeight: "bold",
      }}
    >
      {route.name}
    </Text>
  )}
        </Animated.View>
      );
    },
    tabBarStyle: {
      backgroundColor: 'black',
      height: 65, // ✅ Adjusted for spacing
      borderTopLeftRadius: 15,
      borderTopRightRadius: 15,
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      alignItems: "center",
      justifyContent: "center",
      paddingBottom: 10,
      paddingTop: 10,
      borderTopWidth: 0,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 10,
    },
    headerShown: false,
  })}
>
  <Tab.Screen name="DashboardTab" component={DashboardStackNavigator} />
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
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timeout = setTimeout(() => setReady(true), 300); // 300ms delay for rehydration
    return () => clearTimeout(timeout);
  }, []);

  if (!ready) return null;

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
      <Toast         position='top'
                  bottomOffset={10} 
                  />
    </NavigationContainer>
  );
};

export default AppNavigator;
