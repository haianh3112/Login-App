import { StyleSheet, Text, View, TouchableOpacity } from 'react-native'
import React, { useState,useEffect } from 'react'
import { SocialIcon } from 'react-native-elements';
import { LoginButton, AccessToken ,LoginManager} from 'react-native-fbsdk-next';
import auth,{Authenticated} from '@react-native-firebase/auth';

const LoginFaceBook = () => {
  const [user, setUser] = useState(null);

  const onAuthStateChanged = async userAuth => {
    if (!userAuth) {
      return;
    }
    if (userAuth) {
      console.log(userAuth);
      setUser(userAuth);
    }
    return () => userReference();
  };

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return () => {
      subscriber;
    };
  }, []);


  const signOut = async () => {
    auth().signOut();

    setUser(null);

    return () => userReference();
  };

  async function onFacebookButtonPress(){
    try {
      const result = await LoginManager.logInWithPermissions(['public_profile', 'email']);
      //logInWithPermissions quyền
      if (result.isCancelled) {
        console.log("User cancelled the login process!");
        throw 'User cancelled the login process';
      }
      // Once signed in, get the users AccesToken
      const data = await AccessToken.getCurrentAccessToken();

      if (!data) {
        throw 'Something went wrong obtaining access token';
      }
      // Create a Firebase credential with the AccessToken
      const facebookCredential = auth.FacebookAuthProvider.credential(data.accessToken);

      // Sign-in the user with the credential
      return auth().signInWithCredential(facebookCredential);
    }
    catch (error) {
      alert(error);
    }
  }

  return (
    <View>
      <Text style={styles.titleLoginFaceBook}>Login FaceBook</Text>
      <View style={{margin: 10}}>
        {user === null && (
         <TouchableOpacity onPress={onFacebookButtonPress} style={{alignItems: 'center'}}>
         <LoginButton/>
       </TouchableOpacity>
        )}
      </View>
      {user !== null && (
        <View style={{margin: 10}}>
          <Text style={{margin: 10}}>{user.displayName}</Text>
          <TouchableOpacity onPress={signOut} style={{alignItems: 'center'}}>
            <Button>Sign Out</Button>
          </TouchableOpacity>
        </View>
      )}
    </View>
  )
}

export default LoginFaceBook

const styles = StyleSheet.create({
  titleLoginFaceBook: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    color: '#000'
  }
})