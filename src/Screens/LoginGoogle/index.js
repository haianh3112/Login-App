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
        '911098048649-0fit1c2o0i90f4a35ciotdr3ea020su9.apps.googleusercontent.com', 
      offlineAccess: true, 
    });
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);// run in every componentDidMount event call
    return subscriber; // unsubscribe on unmount hủy đăng nhập khi hủy gắn kết
  }, []);


  //create SignIn arrow function 
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
      // save token in firebase
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

  //log out google function
  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();// thu hồi quyền truy cập
      await GoogleSignin.signOut();//
      auth() //call the signOut method ,successfully logout
        .signOut()
        .then(() => alert('Your are signed out!'));
      setloggedIn(false);
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