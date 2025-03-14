import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, ToastAndroid, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { requestNotificationPermission, scheduleNotification } from '../../utils/notifications';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';

const ReminderScreen = ({ navigation }) => {

  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  const isMounted = useRef(true);

  // Request permissions when screen loads
  useEffect(() => {
    requestNotificationPermission();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      isMounted.current = true;
      return () => { isMounted.current = false; };
    }, [])
  );

  const handleConfirm = (selectedDate) => {
    setPickerVisible(false);
    if (selectedDate) {
      setDate(selectedDate);
    }
  };

  const showNotificationMessage = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.SHORT);
    } else {
      Alert.alert('Notification Set!', message);
    }
  };


  const handleScheduleNotification = async () => {

    try {
      await notifee.requestPermission();

      const trigger: TimestampTrigger = {
        type: TriggerType.TIMESTAMP,
        timestamp: new Date().getTime() + 5000, // 5 seconds from now
      };

      await notifee.createTriggerNotification(
        {
          title: 'Scheduled Reminder',
          body: 'This is your scheduled notification!',
          android: {
            channelId: 'default',
            pressAction: {
              id: 'default',
            },
          },
        },
        trigger
      );

    } catch (error) {
      console.error('Error scheduling notification:', error);
    }

  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Title Section with Add Button */}
        <View style={styles.titleContainer}>
          {/* Back Arrow Icon */}
          <TouchableOpacity onPress={() => navigation.navigate("DashboardMain")} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={20} color={primaryColor} />
          </TouchableOpacity>

          {/* Title (Centered) */}
          <View>
            <Text style={styles.title}>Reminder</Text>
            {/* <Text style={styles.subTitle}>Expense Category</Text> */}
          </View>

          {/* Add Icon on Right */}
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addIcon}>
            <Ionicons name="add" size={20} color={primaryColor} />
          </TouchableOpacity>
        </View>
        {/* Back Button */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
          <Ionicons name="arrow-back" size={20} color="black" />
        </TouchableOpacity>

        {/* Button to open Date Picker */}
        <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dateButton}>
          <Text style={styles.dateText}>{date.toLocaleString()}</Text>
        </TouchableOpacity>
        {setPickerVisible && (
          <DateTimePickerModal
            isVisible={isPickerVisible}
            mode="datetime"
            onConfirm={handleConfirm}
            onCancel={() => setPickerVisible(false)}
          />
        )}
        {/* Schedule Notification Button */}
        <Button title="Set Notification" onPress={handleScheduleNotification} />
      </View>
    </GestureHandlerRootView>
  );

};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: designBackgoundColor, padding: 10 },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures equal spacing between elements
    // paddingHorizontal: 10,
    paddingTop: 50,
    marginBottom: 20,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    color: primaryColor,
    textAlign: "center",
    flex: 1, // Allows title to take available space and center itself
  },
  subTitle: { fontSize: 15, color: secondaryColor, paddingHorizontal: 2, paddingVertical: 5 },

  addButton: { padding: 2, borderRadius: 5 },
  dateButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5 },
  dateText: { color: 'white' },
  backIcon: {
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
  },
});
