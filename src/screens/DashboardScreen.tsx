import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { api } from '../config/api';
import { logout } from '../redux/actions/authActions';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../utils/globalStyle';

const DashboardScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector(state => state.auth);
  const [expenseData, setExpenseData] = useState({
    totalExpenses: 0,
    monthlyBudget: 5000,
    savings: 0,
  });
  const total = expenseData.monthlyBudget - (expenseData.savings + expenseData.totalExpenses);

  useEffect(() => {
    if (!isAuthenticated) {
      navigation.replace('Login');
    }
  }, [isAuthenticated, navigation]);

  return (
    <View style={styles.container}>
      {/* Title Section */}
      <View style={styles.titleContainer}>
        <Text style={styles.title}>Dashboard</Text>
        <Text style={styles.subTitle}>Welcome here!</Text>
      </View>

      {/* Cards Section */}
      <View style={styles.cardContainer}>
         {/* Total Expenses - Bottom Border Color */}
        <View style={[styles.card, {backgroundColor: buttonColor}]}>
          <Ionicons name="wallet-outline" size={30} color={buttonTextSecondaryColor} />
          <Text style={styles.cardValue}>${expenseData.monthlyBudget}</Text>
          <Text style={styles.cardTitle}>Total Income</Text>
        </View>
        {/* Monthly Budget - Bottom Border Color */}
        <View style={[styles.card, {backgroundColor: '#d5bbfc'}]}>
          <Ionicons name="briefcase-outline" size={30} color={buttonTextSecondaryColor} />
          <Text style={styles.cardValue}>${expenseData.totalExpenses}</Text>
          <Text style={styles.cardTitle}>Total Expenses</Text>
        </View>

        {/* Savings - Bottom Border Color */}
        <View style={[styles.card, {backgroundColor: '#edc8aa'}]}>
          <Ionicons name="cash-outline" size={30} color={buttonTextSecondaryColor} />
          <Text style={styles.cardValue}>${expenseData.savings}</Text>
          <Text style={styles.cardTitle}>Balance In Hand</Text>
        </View>

          <View style={[styles.card, {backgroundColor: '#ffadae'}]}>
          <Ionicons name="diamond" size={30} color={buttonTextSecondaryColor} />
          <Text style={styles.cardValue}>${total}</Text>
          <Text style={styles.cardTitle}>Savings</Text>
        </View>


        {/* Savings - Bottom Border Color */}
        {/* <View style={[styles.card, styles.bottomBorderCard]}>
          <Ionicons name="trending-up-outline" size={30} color="blue" />
          <Text style={styles.cardValue}>${total}</Text>
          <Text style={styles.cardTitle}>Balance in hand</Text>
        </View> */}
      </View>
      <View style={styles.navigationContainer}>
    {/* Expense Category Navigation */}
    {/* <View style={styles.navButtonWrapper}>
        <TouchableOpacity 
            style={[styles.navButton, { backgroundColor: '#26e5e2', shadowColor: '#26e5e2' }]} 
            onPress={() => navigation.navigate('ExpenseCategory')}
        >
            <Ionicons name="list-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navButtonText,{color:'black'}]}>Categories</Text>  
    </View> */}

    {/* Another Expense Category Navigation */}
    {/* <View style={styles.navButtonWrapper}>
        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: 'green', shadowColor: 'green' }]}
            onPress={() => navigation.navigate('ExpenseCategory')}
        >
            <Ionicons name="list-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navButtonText,{color:'black'}]}>Expenses</Text>
    </View> */}

        {/* Another Expense Category Navigation */}
        {/* <View style={styles.navButtonWrapper}>
        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: 'gray', shadowColor: 'gray' }]}
            onPress={() => navigation.navigate('ExpenseCategory')}
        >
            <Ionicons name="list-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navButtonText,{color:'black'}]}>Savings</Text>
    </View> */}

        {/* Another Expense Category Navigation */}
        {/* <View style={styles.navButtonWrapper}>
        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: 'purple', shadowColor: 'purple' }]}
            onPress={() => navigation.navigate('ExpenseCategory')}
        >
            <Ionicons name="list-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navButtonText,{color:'black'}]}>Reminders</Text>
    </View> */}

    {/* <View style={styles.navButtonWrapper}>
        <TouchableOpacity
            style={[styles.navButton, { backgroundColor: 'gold', shadowColor: 'gold' }]}
            onPress={() => navigation.navigate('ExpenseCategory')}
        >
            <Ionicons name="list-outline" size={30} color="white" />
        </TouchableOpacity>
        <Text style={[styles.navButtonText,{color:'black'}]}>Note</Text>
    </View> */}
</View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1,  backgroundColor: designBackgoundColor, padding: 10 },

  // Title Styles (No Padding)
  titleContainer: {
    backgroundColor: designBackgoundColor,
    width: '100%',
    //alignItems: 'center',
    marginBottom: 10,
    elevation: 5,
    // borderBottomLeftRadius: 20, // Rounded top-left
    // borderBottomRightRadius: 20
  },
  title: { fontSize: 25, fontWeight: 'bold', color: primaryColor, paddingHorizontal: 10, paddingTop: 50 },
  subTitle: { fontSize: 15, color: secondaryColor, paddingHorizontal: 10, paddingVertical:5 },

  // Cards Section
  cardContainer: { padding: 10, flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', width: '100%' },

  // Default Card Style
  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 5,
    elevation: 2,
    marginTop : 5,
    
  },

  // Bottom Border Colored Card
  bottomBorderCard: {
    borderRightWidth: 5,
    borderRightColor: 'gray',
    // borderBottomWidth: 5,
    // borderBottomColor: '#F5A623',
  },

  // Card Titles & Values
  cardTitle: { fontSize: 10, fontWeight: 'bold', marginTop: 5, color: buttonTextSecondaryColor },
  cardValue: { fontSize: 16, fontWeight: 'bold', color: buttonTextColor, marginTop: 5 },
  
// Cards Section
navigationContainer: { 
  padding: 20, 
  flexDirection: 'row', 
  flexWrap: 'wrap', 
  justifyContent: 'flex-start',  
  gap: 15,  
  width: '100%',
},

// Wrapper for Button & Text
navButtonWrapper: {
  alignItems: 'center',
  width: '21%',  // Ensures up to 4 items per row
},

// Navigation Button (Card)
navButton: {
  justifyContent: 'center',
  alignItems: 'center',
  padding: 10,  
  borderRadius: 10,
  shadowOpacity: 0.5,  
  width: '70%',  // Makes the button fill the wrapper
  aspectRatio: 1,  // Ensures a square shape
  backgroundColor: '#fff',
},

// Navigation Button Text (Below the Card)
navButtonText: {
  marginTop: 8,  // Space between button and text
  fontSize: 12,  
  fontWeight: 'semibold',
  textAlign: 'center',
  color: '#333',
}

});

export default DashboardScreen;
