import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Button,
  FlatList,
  TextInput,
  Alert,
  Modal,
  StyleSheet,
} from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import notifee, { TriggerType } from '@notifee/react-native';
import { textColor, designBackgoundColor, designTextColor, buttonColor, buttonTextColor, buttonTextSecondaryColor, primaryColor, secondaryColor } from '../../utils/globalStyle';


const ReminderScreen = ({ navigation }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [reminders, setReminders] = useState([]);
  const [newReminderText, setNewReminderText] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isPickerVisible, setPickerVisible] = useState(false);
  

  useEffect(() => {
    const interval = setInterval(() => {
      setReminders([...reminders]); // Force re-render
    }, 1000);
    return () => clearInterval(interval);
  }, [reminders]);

  const handleConfirm = (date) => {
    setPickerVisible(false);
    setSelectedDate(date);
  };

  const handleAddReminder = async () => {
    if (!newReminderText.trim()) {
      Alert.alert('Error', 'Please enter a reminder text');
      return;
    }
    const newReminder = { id: Date.now(), text: newReminderText, date: selectedDate, completed: false };
    setReminders([...reminders, newReminder]);
    setModalVisible(false);
    setNewReminderText('');
    scheduleNotification(newReminder);
  };

  const scheduleNotification = async (reminder) => {
    try {
      await notifee.requestPermission();
      await notifee.createTriggerNotification(
        {
          title: 'Reminder',
          body: reminder.text,
          android: {
            channelId: 'default',
          },
        },
        { type: TriggerType.TIMESTAMP, timestamp: reminder.date.getTime() }
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
        onPress: () => setReminders(reminders.filter((reminder) => reminder.id !== id)),
      },
    ]);
  };

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.titleContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backIcon}>
            <Ionicons name="arrow-back" size={20} color={primaryColor} />
          </TouchableOpacity>
          <Text style={styles.title}>Reminders</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.addIcon}>
            <Ionicons name="add" size={20} color={primaryColor} />
          </TouchableOpacity>
        </View>
        <View style={styles.contentContainer}>
          {/* Reminder List */}
          <FlatList
            data={reminders}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View style={styles.reminderItem}>
                <TouchableOpacity onPress={() => handleDeleteReminder(item.id)}>
                  <Ionicons
                     name={new Date(item.time).getTime() <= new Date().getTime() ? "checkbox-outline" : "square-outline"}
                    size={24}
                    color={secondaryColor}
                  />
                </TouchableOpacity>
                <Text style={styles.reminderText}>{item.text} - {item.date.toLocaleString()}</Text>
              </View>
            )}
          />
        </View>

        {/* Modal for Adding Reminder */}
        <Modal visible={modalVisible} animationType="slide" transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Add Reminder</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter Reminder"
                placeholderTextColor="#aaa"
                value={newReminderText}
                onChangeText={setNewReminderText}
              />
              <TouchableOpacity onPress={() => setPickerVisible(true)} style={styles.dateButton}>
                <Text style={styles.dateText}>Pick Date & Time</Text>
              </TouchableOpacity>
              <DateTimePickerModal
                isVisible={isPickerVisible}
                mode="datetime"
                onConfirm={handleConfirm}
                onCancel={() => setPickerVisible(false)}
              />
              <View style={styles.modalButtons}>
                <TouchableOpacity
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setModalVisible(false)}
                >
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
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures equal spacing between elements
    // paddingHorizontal: 10,
    paddingTop: 50,
    marginBottom: 40,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between", // Ensures equal spacing between elements
    // paddingHorizontal: 10,
    marginBottom: 40,
    backgroundColor: "black",
    padding: 10,

  },
  backIcon: {
    padding: 5,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
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
  reminderItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reminderText: { fontSize: 14, marginLeft: 10, flex: 1, color: primaryColor },
  dateButton: { backgroundColor: '#2196F3', padding: 10, borderRadius: 5, marginBottom: 10 },
  dateText: { color: 'white', textAlign: 'center' },

  modalContainer: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.8)" },
  modalContent: { backgroundColor: "#1e1e1e", padding: 20, borderRadius: 10, width: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "bold", marginBottom: 10, color: "#fff" },
  input: { borderWidth: 1, borderColor: "#444", padding: 10, borderRadius: 5, marginBottom: 10, color: "#fff" },
  modalButtons: { flexDirection: "row", justifyContent: "space-between" },
  button: { backgroundColor: buttonColor, padding: 10, borderRadius: 5, flex: 1, alignItems: "center", marginHorizontal: 5 },
  cancelButton: { backgroundColor: "#ffadae" },
  buttonText: { color: buttonTextColor, fontWeight: "bold" },
});

export default ReminderScreen;
