import notifee, { AndroidImportance, TriggerType, TimestampTrigger } from '@notifee/react-native';
import { Alert, Platform } from 'react-native';
import messaging from '@react-native-firebase/messaging';

// Request notification permissions
export const requestPermissions = async () => {
  const settings = await notifee.requestPermission();
  if (settings.authorizationStatus === notifee.AuthorizationStatus.DENIED) {
    console.warn('User denied notification permissions.');
  }
};

// Schedule a reminder notification
export const scheduleReminder = async (title, body, timestamp) => {
  try {
    const trigger = {
      type: TriggerType.TIMESTAMP,
      timestamp, // Time when notification should fire
    };

    // Create a notification channel (for Android)
    const channelId = await notifee.createChannel({
      id: 'reminders',
      name: 'Reminders',
      importance: notifee.Importance.HIGH,
    });

    // Schedule the notification
    await notifee.createTriggerNotification(
      {
        title,
        body,
        android: {
          channelId,
          pressAction: {
            id: 'default',
          },
        },
        ios: {
          sound: 'default',
        },
      },
      trigger
    );

    console.log(`Reminder scheduled for ${new Date(timestamp)}`);
  } catch (error) {
    console.error('Error scheduling reminder:', error);
  }
};

// Request notification permissions
export const requestNotificationPermission = async () => {
    try {
      const settings = await notifee.requestPermission();
  
      if (settings.authorizationStatus === 1) {
        console.log('Notification permission granted.');
      } else {
        Alert.alert('Permission Denied', 'Please enable notifications in settings.');
      }
  
      if (Platform.OS === 'android') {
        await notifee.createChannel({
          id: 'default',
          name: 'Default Channel',
          importance: 4, // Use numeric value instead of AndroidImportance.HIGH
        });
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
    }
  };
  
  // Schedule a notification
  export const scheduleNotification = async (title, body, timestamp) => {
    try {
      const trigger = {
        type: TriggerType.TIMESTAMP,
        timestamp, // Time in milliseconds
      };
  
      await notifee.createTriggerNotification(
        {
          title,
          body,
          android: { channelId: 'default', pressAction: { id: 'default' } },
        },
        trigger
      );
  
      console.log('Notification scheduled for:', new Date(timestamp).toLocaleString());
    } catch (error) {
      console.error('Error scheduling notification:', error);
    }
  };