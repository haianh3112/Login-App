import { View, Text, SafeAreaView, StyleSheet, Image, TouchableOpacity ,ScrollView} from 'react-native'
import React, { useEffect, useState } from 'react';
import messaging from '@react-native-firebase/messaging';
import LoginGoogle from './src/Screens/LoginGoogle';
import LoginFaceBook from './src/Screens/LoginFaceBook';
import CallApi from './src/Screens/CallApi';


const App = () => {
  const [notification, setNotification] = useState({
    title: undefined,
    body: undefined,
    image: undefined,
  });
// lấy token
  const getToken = async () => {
    const token = await messaging().getToken();
    console.log('token.... ', token);
  };

  //Foreground application is open and in view
  useEffect(() => {
    getToken();
    messaging().onMessage(async remoteMessage => {
      console.log('A new FCM message arrived!', JSON.stringify(remoteMessage));
      setNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        image: remoteMessage.notification.android.imageUrl,
      });
    });

    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log('onNotificationOpenedApp: ', JSON.stringify(remoteMessage));
      //chạy khi ở chế độ background
      setNotification({
        title: remoteMessage.notification.title,
        body: remoteMessage.notification.body,
        image: remoteMessage.notification.android.imageUrl,
      });
    })

    // kiểm tra thông báo ban đầu
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            JSON.stringify(remoteMessage),
          );
          setNotification({
            title: remoteMessage.notification.title,
            body: remoteMessage.notification.body,
            image: remoteMessage.notification.android.imageUrl,
          });
        }
      });
  }, []);


  return (
    <SafeAreaView>
      <ScrollView>
      <View style={styles.LoginApp}>
        <LoginGoogle styles={styles.LoginGoogle}/>
       <LoginFaceBook/>
      </View>
      <View style={styles.headMessaging}>
        <Text style={styles.TextNon}>Push Notification </Text>
        <Text style={styles.TitleNon}>{`Name: ${notification?.title}`}</Text>
        <Text style={styles.TitleNon}>{`About me: ${notification?.body}`}</Text>
        <Image style={styles.ImageNon} source={{ uri: notification?.image }} />
      </View>
      <View>
      <CallApi/>
      </View>
      </ScrollView>
    </SafeAreaView>
  )
}
const styles = StyleSheet.create({
  headMessaging: {
    alignItems: 'center',
    marginVertical: 20,
    textAlign: 'center',
    justifyContent: 'center'
  },
  TextNon: {
    fontSize: 30,
    color: 'black'
  },
  TitleNon: {
    fontSize: 20,
    color: 'gray'
  },
  ImageNon: {
    marginTop: 20,
    width: 230,
    height: 230,
    borderRadius: 500
  },
  LoginApp:{
    marginTop:20,
    marginHorizontal:30,
    alignItems:'center'
  }
})

export default App