import React, { useEffect, useState,  } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api, API_URL } from '../config/api'; 
import { logout } from '../redux/actions/authActions';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [userData, setUserData] = useState(null);

  const fetchUser = async () => {
    try {
      const response = await api.get('/user'); 
      setUserData(response.data.user);
    } catch (error) {
      console.error("Error fetching user:", error);
    }
  };

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Home');
    } else {
      fetchUser();
    }
  }, [isAuthenticated, navigation]);


  const handleLogout = () => {
    dispatch(logout());
  };


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to Dashboard </Text>
      {userData ? (
        <View style={styles.userInfo}>
          <Text style={styles.text}>Name: {userData.name}</Text>
          <Text style={styles.text}>Email: {userData.email}</Text>
        </View>
      ) : (
        <Text style={styles.text}>Fetching user data...</Text>
      )}
      <TouchableOpacity style={styles.button} onPress={handleLogout}>
        <Text style={styles.buttonText}>Logout</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 20 },
  userInfo: { marginBottom: 20, alignItems: 'center' },
  text: { fontSize: 18, marginBottom: 5 },
  button: { backgroundColor: 'red', padding: 10, width: 120, alignItems: 'center', borderRadius: 5 },
  buttonText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
});

export default DashboardScreen;