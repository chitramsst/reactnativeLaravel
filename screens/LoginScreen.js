import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }

    dispatch(login(email, password));
  };

  // Redirect to Dashboard when logged in
  if (isAuthenticated) {
    navigation.replace('Dashboard');
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput style={styles.input} placeholder="Email" onChangeText={setEmail} />
      <TextInput style={styles.input} placeholder="Password" secureTextEntry onChangeText={setPassword} />
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  input: { width: 300, height: 40, borderBottomWidth: 1, marginBottom: 20 },
  button: { backgroundColor: 'blue', padding: 10, width: 100, alignItems: 'center' },
  buttonText: { color: 'white', fontSize: 18 },
});

export default LoginScreen;
