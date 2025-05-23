import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, 
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { useNavigation, useRoute } from '@react-navigation/native';
import { designBackgoundColor, primaryColor, secondaryColor, buttonColor, buttonTextColor } from '../utils/globalStyle'; 
import Toast from 'react-native-toast-message';
import { NavigationProp } from '@react-navigation/native';
import { RootStackParamList } from '../types/types.ts';
import {RootState} from '../types/types.ts'
import { AnyAction } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

const LoginScreen = () => {
  const navigation = useNavigation<NavigationProp<RootStackParamList>>();
  const route = useRoute(); 

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch: ThunkDispatch<RootState, void, AnyAction> = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      //Alert.alert('Error', 'Email and Password are required');
      Toast.show({
        type: 'error',
        text1: 'Login Failed',
        text2: 'Email and Password is required.'
      });
      return;
    }
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated && route.name !== 'Dashboard') {
      navigation.navigate('Dashboard');
    }
  }, [isAuthenticated, navigation, route.name]); 

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"} 
      style={[styles.container, { backgroundColor: designBackgoundColor }]} // ✅ Apply background color dynamically
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>Login</Text>
          <TextInput 
            style={styles.input} 
            placeholder="Email" 
            placeholderTextColor={secondaryColor}
            value={email} 
            onChangeText={setEmail} 
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <TextInput 
            style={styles.input} 
            placeholder="Password" 
            placeholderTextColor={secondaryColor}
            value={password} 
            onChangeText={setPassword} 
            secureTextEntry
          />
          <TouchableOpacity style={styles.button} onPress={handleLogin}>
            <Text style={styles.buttonText}>Login</Text>
          </TouchableOpacity>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    width: '100%',
  },
  inner: { 
    width: '80%', 
    alignItems: 'center',
  },
  title: { 
    fontSize: 24, 
    marginBottom: 20, 
    fontWeight: 'bold', 
    color: primaryColor,   
    fontFamily: Platform.OS === 'ios' ? 'DancingScript' : 'DancingScript-Regular' // ✅ Fixed font handling
  },
  input: { 
    width: '100%', 
    height: 40, 
    borderBottomWidth: 1, 
    marginBottom: 20, 
    paddingHorizontal: 10, 
    color: primaryColor, 
    borderBottomColor: 'lightgray' 
  },
  button: { 
    backgroundColor: '#ffadae', 
    padding: 12, 
    width: '100%', 
    alignItems: 'center', 
    borderRadius: 5, 
    marginTop: 10,
  },
  buttonText: { 
    color: buttonTextColor, 
    fontSize: 18, 
    fontWeight: 'bold' 
  },
});

export default LoginScreen;
