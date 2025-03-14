import AsyncStorage from '@react-native-async-storage/async-storage';

const REMINDERS_KEY = 'reminders';

// Save reminders
export const saveReminder = async (reminder) => {
  try {
    let reminders = await AsyncStorage.getItem(REMINDERS_KEY);
    reminders = reminders ? JSON.parse(reminders) : [];
    reminders.push(reminder);
    await AsyncStorage.setItem(REMINDERS_KEY, JSON.stringify(reminders));
  } catch (error) {
    console.error('Error saving reminder:', error);
  }
};

// Get reminders
export const getReminders = async () => {
  try {
    const reminders = await AsyncStorage.getItem(REMINDERS_KEY);
    return reminders ? JSON.parse(reminders) : [];
  } catch (error) {
    console.error('Error retrieving reminders:', error);
    return [];
  }
};
