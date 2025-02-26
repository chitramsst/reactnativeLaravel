import React, { useState, useEffect } from 'react';
import { 
  View, Text, TextInput, TouchableOpacity, Alert, StyleSheet, Image,
  KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, ImageBackground 
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../redux/actions/authActions';
import { useNavigation, useRoute } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  const route = useRoute(); 
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);

  const handleLogin = () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Error', 'Email and Password are required');
      return;
    }
    dispatch(login(email, password));
  };

  useEffect(() => {
    if (isAuthenticated && route.name !== 'Dashboard') {
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, navigation, route.name]); 


  return (
    <ImageBackground 
      source={require('../assets/images/money2.webp')} 
      style={styles.background}
      resizeMode="cover"
      blurRadius={30} // Adding blur effect
    >
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.container}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.inner}>
          {/* <Image source={require('../assets/images/loginlogo.png')} style={styles.logo} /> */}
            <Text style={styles.title}>Login</Text>
            <TextInput 
              style={styles.input} 
              placeholder="Email" 
              placeholderTextColor="lightgray"
              value={email} 
              onChangeText={setEmail} 
              keyboardType="email-address"
              autoCapitalize="none"
            />
            <TextInput 
              style={styles.input} 
              placeholder="Password" 
              placeholderTextColor="lightgray"
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
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, width: '100%', height: '100%', position: 'absolute', backgroundColor: '#013220' }, // Dark green with black theme
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', width: '100%' },
  inner: { 
    width: '80%', alignItems: 'center',
  },
  title: { fontSize: 24, marginBottom: 20, fontWeight: 'bold', color: 'white',   fontFamily: 'DancingScript' },
  input: { 
    width: '100%', height: 40, borderBottomWidth: 1, 
    marginBottom: 20, paddingHorizontal: 10, color: 'white', borderBottomColor: 'lightgray' 
  },
  logo: { width: 100, height: 100, marginBottom: 20, backgroundColor: 'transparent' },
  button: { 
    backgroundColor: '#193d52', padding: 12, width: '100%', 
    alignItems: 'center', borderRadius: 5, marginTop: 10 
  },
  buttonText: { color: '#eaeff3', fontSize: 18, fontWeight: 'bold' },
});

export default LoginScreen;
