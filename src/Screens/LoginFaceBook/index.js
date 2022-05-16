import { StyleSheet, Text, View, TouchableOpacity, Image, Button } from 'react-native'
import React, { useState, useEffect } from 'react'
import auth, { Authenticated } from '@react-native-firebase/auth';
import { SocialIcon } from 'react-native-elements';
import {
  AccessToken,
  LoginManager,
  GraphRequest,
  GraphRequestManager,
  Permissions
} from 'react-native-fbsdk';


const LoginButton = () => {
  const [loggedIn, setLoggedIn] = useState(false);

  const login = () => {
    LoginManager.logInWithPermissions(['public_profile','email']).then((result) => {
      if (result.error) {
        console.log('Error: ', result.error);
      } else {
        if (result.isCancelled) {
          console.log('Login is cancelled');
        } else {
          setLoggedIn(true);
          console.log('Logged in: ', result); // have acess token
        }
      }
    })
  }

  const logout = () => {
    LoginManager.logOut();
    setLoggedIn(false);
    console.log('Logout');
  }

  if (loggedIn)
    return (
      <View>
        <FbBasicInfo loggedIn={loggedIn} />
        <SocialIcon
        style={ styles.ButtonLogin}
        button
        type='facebook'
        title='Logout'
        onPress={logout}
        />
      </View>
    )
    return (
    <SocialIcon
    style={ styles.ButtonLogin}
      title='Sign in With Facebook'
      button
      type='facebook'
      onPress={login}
    />
  )
}

function FbBasicInfo({
  loggedIn
}) {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState('');
  const [email, setemail] = useState('');

  // if login success, you have an access token , get access token  from "AccessToken"

  function getBasicInfo() {
    AccessToken.getCurrentAccessToken().then(data => {
      const { accessToken } = data;

      //create graphRequest
      
      let graphRequest = new GraphRequest('/me', {
        accessToken,
        parameters: {
          fields: {
            //usesing graph api users
            string: 'picture.type(large),name,email',//get avatar ,image,name,email
          }
        }
      }, (error, result) => {
        const {
          picture: {
            data
          },
          name,email,
        } = result;
        //get info
        if (error) {
          console.log(error);
        } else {
          console.log(result);
          setAvatar(data);
          setName(name);
          setemail(email);
          //set info
        }
      });
      const graphRequestManager = new GraphRequestManager();
      graphRequestManager.addRequest(graphRequest).start();
      //
    });
  }

  useEffect(() => {
    getBasicInfo();
  }, [loggedIn]);
  //if loggedIn success , then getBasicInfo() call

  // useEffect(() => {
  //   console.log(avatar);
  // }, [avatar]);
  // //

  if (!loggedIn || !avatar)
    return null;

  const { url, width, height } = avatar;
  return (
    <View style={{
      alignItems: 'center',
      alignContent: 'center',
      justifyContent: 'center',
    }}>
      <Image
        source={{ uri: url }}
        style={styles.avatar}
        width={width}
        height={height}
      />
      <Text style={styles.name}>{name}</Text>
      <Text style={styles.email}>{email}</Text>
    </View>
  )
}


const LoginFaceBook = () => {
  return (
    <View >
      <Text style={{textAlign:'center',fontSize:20,color:'#000'}}>Login FaceBook</Text>
      <LoginButton />
    </View>
  );
}
export default LoginFaceBook

const styles = StyleSheet.create({
  titleLoginFaceBook: {
    textAlign: 'center',
    fontSize: 20,
    marginBottom: 10,
    color: '#000'
  },
  avatar: {
    marginTop: 20,
    width: 230,
    height: 230,
    borderRadius: 500
  },
  name:{
    color:"#000",
    marginVertical:18
  }
  ,
  ButtonLogin:{
    width: 180, 
    height: 50,
    borderRadius:3
  }
})