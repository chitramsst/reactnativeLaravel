import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Button, StyleSheet, Alert, ToastAndroid, Platform } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { requestNotificationPermission, scheduleNotification } from '../../utils/notifications';
import { useFocusEffect } from '@react-navigation/native';
import notifee, { TriggerType, TimestampTrigger } from '@notifee/react-native';

const ReminderScreen = ({ navigation }) => {

  const [date, setDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(true);
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
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
        <Ionicons name="arrow-back" size={20} color="black" />
      </TouchableOpacity>

      {/* Title */}
      <Text style={styles.title}>Schedule Notification:</Text>

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
  );
  
};

export default ReminderScreen;

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white' },
  title: { fontSize: 18, marginBottom: 10, color: 'black' },
  dateButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5 },
  dateText: { color: 'white' },
  backIcon: { position: 'absolute', top: 50, left: 20, padding: 5 },
});
