import React, { useEffect } from 'react';
import { 
  View, Text, Image, StyleSheet, TouchableWithoutFeedback 
} from 'react-native';
import { useSelector } from 'react-redux';
import { designBackgoundColor } from "../utils/globalStyle"; // ✅ Corrected import name

const HomeScreen = ({ navigation }) => {
  const { isAuthenticated } = useSelector(state => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigation.replace('Dashboard');
    }
  }, [isAuthenticated, navigation]);

  const handleScreenPress = () => {
    navigation.navigate(isAuthenticated ? 'Dashboard' : 'Login');
  };

  return (
    <TouchableWithoutFeedback onPress={handleScreenPress}>
      <View style={styles.background}>
        <View style={styles.container}>
          <Image source={require('../assets/images/logo1.png')} style={styles.logo} />
          <Text style={styles.title}>Expense Management</Text>
          <Text style={styles.subtitle}>(Tap anywhere to continue)</Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: { 
    flex: 1, 
    width: '100%', 
    height: '100%', 
    backgroundColor: designBackgoundColor, // ✅ Use variable correctly
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  container: { 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
    paddingHorizontal: 20,
  },
  logo: { 
    width: 220, 
    height: 220, 
    marginBottom: 75, 
    resizeMode: 'contain' 
  },
  title: { 
    fontSize: 26, 
    fontWeight: 'bold', 
    color: 'white', 
    textAlign: 'center' 
  },
  subtitle: {
    fontSize: 14, 
    color: 'lightgray', 
    marginTop: 10, 
    textAlign: 'center'
  }
});

export default HomeScreen;
