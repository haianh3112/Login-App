
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';
import PushNotification from "react-native-push-notification";

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  // PushNotification.configure({
  //     // (required) Called when a remote is received or opened, or local notification is opened
  // onNotification: function (notification) {
  //   console.log("NOTIFICATION:", notification);
  // },
  // requestPermissions: Platform.OS === 'ios'
  // })

AppRegistry.registerComponent(appName, () => App);
