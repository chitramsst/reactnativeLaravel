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
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { TriggerType } from '@notifee/react-native';
import {
  textColor,
  buttonColor,
  buttonTextColor,
  primaryColor,
  secondaryColor,
  designBackgoundColor,
} from '../../utils/globalStyle';

const ReminderScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isPickerVisible, setPickerVisible] = useState(false);
  const [currentTime, setCurrentTime] = useState(Date.now());

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

  const handleConfirm = (date: Date) => {
    Alert.alert("Selected Date", date.toLocaleString());

    if (date instanceof Date && !isNaN(date.getTime())) {
      setSelectedDate(date); // Ensure it's a valid Date object
    } else {
      console.error("Invalid Date Selected");
    }
    setPickerVisible(false);
  };


  const handleAddReminder = async () => {
    if (!newReminderText.trim()) {
      Alert.alert('Error', 'Please enter a reminder text');
      return;
    }

    if (!selectedDate) {
      Alert.alert('Error', 'Please select a date and time');
      return;
    }

    const currentDateTime = new Date();
    if (selectedDate.getTime() <= currentDateTime.getTime()) {
      Alert.alert('Error', 'Please select a future date and time');
      return;
    }

    const newReminder = { id: Date.now(), text: newReminderText, date: selectedDate, completed: false };
    const updatedReminders = [...reminders, newReminder];
    setReminders(updatedReminders);
    saveReminders(updatedReminders);
    setModalVisible(false);
    setNewReminderText('');
    scheduleNotification(newReminder);
    setSelectedDate(null); // Reset selected date after adding
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
            setSelectedDate(null); setNewReminderText(''); // Ensure selectedDate is not null
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
              <View style={styles.reminderItem}>
                <Ionicons name="alarm" size={24} color={secondaryColor} />
                <Text style={styles.reminderText}>
                  {item.text} - {reminderTime.toLocaleString()}
                </Text>
                <TouchableOpacity onPress={() => isChecked && handleDeleteReminder(item.id)}>
                  <Ionicons
                    name={isChecked ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color={secondaryColor}
                  />
                </TouchableOpacity>
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
                  {selectedDate ? selectedDate.toLocaleString() : 'Pick Date & Time'}
                </Text>
              </TouchableOpacity>

              <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="datetime"
                date={selectedDate || new Date()}
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
                display={Platform.OS === "ios" ? "inline" : "default"}
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
  container: { flex: 1, backgroundColor: designBackgoundColor, padding: 10 },
  titleContainer: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingTop: 50, marginBottom: 40 },
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
