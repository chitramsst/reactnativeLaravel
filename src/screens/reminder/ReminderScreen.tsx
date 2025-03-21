import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
  Platform,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { TriggerType } from '@notifee/react-native';
import { Button } from "react-native-paper";
import {
  textColor,
  buttonColor,
  buttonTextColor,
  primaryColor,
  secondaryColor,
  designBackgoundColor,
} from '../../utils/globalStyle';
import { DatePickerModal, TimePickerModal } from 'react-native-paper-dates';
import { enGB, registerTranslation } from 'react-native-paper-dates'
registerTranslation('en-GB', enGB)

const ReminderScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());
  const [time, setTime] = useState<{ hours: number; minutes: number } | null>(null);
  const [timeVisible, setTimeVisible] = useState(false);


  useEffect(() => {
    loadReminders();
    const interval = setInterval(() => setCurrentTime(Date.now()), 1000);
    return () => clearInterval(interval);
  }, []);

  const saveReminders = async (reminders) => {
    try {
      await AsyncStorage.setItem('reminders', JSON.stringify(reminders));
    } catch (error) {
      console.error('Error saving reminders:', error);
    }
  };

  const onDateConfirm = (params: { date: Date }) => {
    setSelectedDate(params.date);
    setPickerVisible(false);
  };

  // Handle Time Selection
  const onTimeConfirm = ({ hours, minutes }: { hours: number; minutes: number }) => {
    setTime({ hours, minutes });
    setTimeVisible(false);
  };


  const loadReminders = async () => {
    try {
      const storedReminders = await AsyncStorage.getItem('reminders');
      if (storedReminders) {
        setReminders(JSON.parse(storedReminders));
      }
    } catch (error) {
      console.error('Error loading reminders:', error);
    }
  };

  const onConfirmSingle = React.useCallback(
    (params) => {
      setPickerVisible(false);
      if (params.date instanceof Date && !isNaN(params.date.getTime())) {
        setSelectedDate(params.date); // Ensure it's a valid Date object
        setTimeVisible(true);
      } else {
        console.error("Invalid Date Selected");
      }
    },
    [setPickerVisible, setSelectedDate]
  );


  const handleAddReminder = async () => {
    if (!newReminderText.trim()) {
      Alert.alert('Error', 'Please enter a reminder text');
      return;
    }

    if (!selectedDate || !time) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    const reminderDateTime = new Date(selectedDate);
    reminderDateTime.setHours(time.hours, time.minutes, 0, 0);

    if (reminderDateTime < new Date()) {
      Alert.alert('Error', 'Reminder time must be in the future');
      return;
    }

    const newReminder = {
      id: Date.now(),
      text: newReminderText,
      date: reminderDateTime.toISOString(),
      completed: false,
    };

    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    saveReminders(updatedReminders);

    setModalVisible(false);
    setNewReminderText('');
    setSelectedDate(null);
    setTime(null);

    scheduleNotification(newReminder);
  };

  const scheduleNotification = async (reminder) => {
    try {
      await notifee.requestPermission();
      await notifee.createTriggerNotification(
        {
          title: 'Reminder',
          body: reminder.text,
          android: { channelId: 'default' },
        },
        { type: TriggerType.TIMESTAMP, timestamp: new Date(reminder.date).getTime() }
      );
    } catch (error) {
      console.error('Notification error:', error);
    }
  };

  const handleDeleteReminder = (id) => {
    Alert.alert('Delete Reminder', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        onPress: () => {
          const updatedReminders = reminders.filter((reminder) => reminder.id !== id);
          setReminders(updatedReminders);
          saveReminders(updatedReminders);
        },
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>

        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={24} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Reminders</Text>
          <TouchableOpacity onPress={() => {
            setSelectedDate(null); setNewReminderText(''); 
            setModalVisible(true);
          }} style={styles.addIcon}>
            <Ionicons name="add" size={24} color={primaryColor} />
          </TouchableOpacity>
        </View>

        <FlatList
  data={reminders}
  keyExtractor={(item) => item.id.toString()}
  renderItem={({ item }) => {
    const reminderTime = new Date(item.date);
    const isChecked = !isNaN(reminderTime.getTime()) && reminderTime.getTime() <= currentTime;

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Ionicons name="alarm" size={24} color="white" style={styles.alarmIcon} />
          <View style={styles.textContainer}>
            <Text style={styles.reminderTitle}>{item.text}</Text>
            <Text style={styles.reminderDate}>{reminderTime.toLocaleString()}</Text>
          </View>
          <TouchableOpacity onPress={() => isChecked && handleDeleteReminder(item.id)}>
            <Ionicons
              name={isChecked ? "checkbox-outline" : "square-outline"}
              size={24}
              color="white"
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }}
/>


        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={[styles.modalTitle, { paddingBottom: 10, color: primaryColor }]}>Reminder Info</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Reminder"
                placeholderTextColor={secondaryColor}
                value={newReminderText}
                onChangeText={setNewReminderText}
              />
              <TouchableOpacity
                onPress={() => {
                  console.log("Picker Opened");
                  setPickerVisible(true);
                }}
                style={styles.dateButton}
              >
                <Text style={styles.dateText}>
                  {selectedDate ? selectedDate.toDateString() : 'Pick Date & Time'} 
                  {"  "}
                  {time ? time.hours + ':' + time.minutes : ''}
                </Text>
              </TouchableOpacity>

              <DatePickerModal
                locale="en"
                mode="single"
                visible={isPickerVisible}
                onDismiss={() => setPickerVisible(false)}
                onConfirm={(params) => {
                  //handleConfirm(params.date);
                  onConfirmSingle(params)
                  setPickerVisible(false)
                }}
              />
              {/* Open Time Picker (Triggered Automatically) */}
              <TimePickerModal
                visible={timeVisible}
                onDismiss={() => setTimeVisible(false)}
                onConfirm={onTimeConfirm}
                hours={time?.hours || 12} // Default to 12:00
                minutes={time?.minutes || 0}
              />

              <View style={styles.modalButtons}>
                <TouchableOpacity style={[styles.button, styles.cancelButton]} onPress={() => setModalVisible(false)}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={handleAddReminder}>
                  <Text style={styles.buttonText}>Add</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#000000",
    borderRadius: 10,
    marginVertical: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  alarmIcon: {
    padding: 10,
    backgroundColor: "#ff6b6b",
    borderRadius: 8,
  },
  textContainer: {
    flex: 1,
    marginLeft: 15,
  },
  reminderTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#fff",
  },
  reminderDate: {
    fontSize: 13,
    color: "#ccc",
    marginTop: 5,
  },
  container: { flex: 1, backgroundColor: designBackgoundColor, padding: 10 },
  titleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 50, marginBottom: 10 },
  backIcon: { padding: 5, borderRadius: 5 },
  title: { fontSize: 18, fontWeight: "bold", color: primaryColor, textAlign: "center", flex: 1 },
  reminderItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reminderText: { fontSize: 14, marginLeft: 10, flex: 1, color: primaryColor },
  dateButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginBottom: 10 },
  dateText: { color: 'white', textAlign: 'center' },
  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  modalContent: { backgroundColor: "#1e1e1e", padding: 20, borderRadius: 10, width: "80%" },
  input: { borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 5, marginBottom: 10, color: "#fff" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: buttonColor, padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#ffadae" },
  buttonText: { color: buttonTextColor, fontWeight: "bold" },
});

export default ReminderScreen;
