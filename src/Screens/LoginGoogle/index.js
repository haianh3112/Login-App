import { StyleSheet, Text, View , Button,TouchableOpacity} from 'react-native'
import React ,{useState, useEffect}from 'react';
import auth from '@react-native-firebase/auth';

  import { GoogleSignin,
    GoogleSigninButton,
    statusCodes } from '@react-native-google-signin/google-signin';
  
const LoginGoogle = () => {

  const [loggedIn, setloggedIn] = useState(false);
  const [user, setUser] = useState([]);

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['email'], 
      webClientId:
        '322286351118-etab1knhf4rru03u8e45j90l65h4ir51.apps.googleusercontent.com', 
      offlineAccess: true, 
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, []);



  const SignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {accessToken, idToken} = await GoogleSignin.signIn();
      setloggedIn(true);
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      await auth().signInWithCredential(credential);
    } 
    catch (error) {
      if (error.code === statusCodes.SIGN_IN_CANCELLED) {
     
        console.log(error);
      } else if (error.code === statusCodes.IN_PROGRESS) {
        console.log(error);
       
      } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
        console.log(error);
      } else {
        console.log(error);
      }
    }
  };

  function onAuthStateChanged(user) {
    setUser(user);
    console.log(user);
    if (user) setloggedIn(true);
  }

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      auth()
        .signOut()
        .then(() => alert('Your are signed out!'));
      setloggedIn(false);
      // setUser([]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View>
      <Text style={styles.titleLoginGoogle}>Login Google</Text>
      <TouchableOpacity activeOpacity={0.9}>
      <View style={styles.sectionContainer}>
      {!loggedIn && (
              <GoogleSigninButton
                style={{width: 192, height: 48}}
                size={GoogleSigninButton.Size.Wide}
                color={GoogleSigninButton.Color.Dark}
                onPress={SignIn}
              />
              )}
        </View>
        </TouchableOpacity>
        <View style={styles.buttonContainer}>
        {!user && <Text style={styles.signOut}>Logged out</Text>}
              {user && (
                <Button
                  onPress={signOut}
                  title="LogOut"
                  color="blue"></Button>
              )}
        </View>
    </View>
  )
}

export default LoginGoogle

const styles = StyleSheet.create({
  titleLoginGoogle:{
   textAlign:'center',
   fontSize:20,
   marginBottom:10,
   color:'#000'
  },
  signOut:{
    textAlign:'center',
    marginBottom:20
  }
})