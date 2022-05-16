
import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async remoteMessage => {
    console.log('Message handled in the background!', remoteMessage);
  });

  // MyAppNotification.configure({
  //     // (required) Called when a remote is received or opened, or local notification is opened
  // onNotification: function (notification) {
  //   console.log("NOTIFICATION:", notification);
  // },
  // requestPermissions: Platform.OS === 'ios'
  // })

AppRegistry.registerComponent(appName, () => App);
