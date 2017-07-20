import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';

//import { FBLogin, FBLoginManager } from 'react-native-facebook-login';

import { View, StyleSheet, Text, Image, Dimensions } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import * as firebase from 'firebase';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo';
import { saveAppStateAction } from '../../redux/modules/saveAppState';
import { mapStateToProps } from '../common/functions';
import Header from '../common/Header';
import Wingman from '../../images/wingHorse.jpeg';

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
    marginTop: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  // headerText: {
  //   marginTop: 40,
  //   lineHeight: 32,
  //   fontSize: 24,
  // },
  bodyText: {
    fontSize: 14,
    width: 300,
  },
  footer: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    height: 250,
    width: 250,
  },
  headerText: {
    fontSize: 22,
    marginBottom: 30,
    marginTop: 60,
  },
  paragraph: {
    fontSize: 18,
    color: 'gray',
    marginLeft: 30,
    marginRight: 30,
    justifyContent: 'center',
    textAlign: 'center',
  },
  loginButtonView: {
    marginTop: 30,
  },
});

const config = {
  apiKey: 'AIzaSyDrQpV3-mc6-hGGJAroP9le4boFeHrG1aM',
  authDomain: 'wingman-f33a2.firebaseapp.com',
  databaseURL: 'https://wingman-f33a2.firebaseio.com',
  projectId: 'wingman-f33a2',
  storageBucket: 'wingman-f33a2.appspot.com',
  messagingSenderId: '118390179615',
};

firebase.initializeApp(config);

function goToUserSetup() {
  Actions.createProfile();
}

export class Login extends Component {

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        this.checkIfExistingUser(user);
      }
    });
  //  this.createUser();
  }

  setUpNewUser = (facebookData) => {
    const saveUserData = { name: facebookData.displayName,
      profile_picture: facebookData.photoURL,
      id: facebookData.uid };
    firebase.database().ref(`users/${facebookData.uid}`).set(saveUserData).then(
      this.handleNewUser(saveUserData),
    );
  }

  checkIfExistingUser(facebookData) {
    const that = this;
    firebase.database().ref(`users/${facebookData.uid}`).once('value').then((data) => {
      if (!data.val()) {
        return that.setUpNewUser(facebookData);
      }
      if (data.val().age) {
        return that.goToTabMenu(facebookData.uid);
      }
      return that.setUpNewUser(facebookData);
    });
  }

  // componentDidMount() {
  //   const that = this
  //   firebase.auth().onAuthStateChanged(function(user) {
  //     if(user) {
  //       that.checkIfExistingUser(user);
  //
  //   // User is signed in.
  //   } else {
  //   // No user is signed in.
  //     }
  //   });
  // //  this.createUser()
  // //  emailLogin()
  //   // AccessToken.getCurrentAccessToken().then(
  //   //   (data) => {
  //   //     console.log(data);
  //   //     if (data.accessToken) {
  //   //       this.login();
  //   //     }
  //   //   },
  //   // );
  // }

  createUser = () => {
    firebase.auth().signInWithEmailAndPassword('q@live.se', '123456').then(() => {
    });
  //   firebase.auth().createUserWithEmailAndPassword('qaaaaa@live.se', '123456').then(() => {
  // // Handle Errors here.
  //   // var errorCode = error.code;
  //   // var errorMessage = error.message;
  // // ...
  //   });
  }

  handleNewUser(saveData) {
    this.saveToRedux(saveData);
    goToUserSetup();
  }

  saveToRedux = (saveData) => {
    return this.props.dispatch(saveUserInfoAction(saveData))
  }

  goToTabMenu = (id) => {
    console.log('in tabMenu')
    const that = this;
    firebase.database().ref(`users/${id}`).once('value').then((data) => {
      that.saveToRedux(data.val());
      that.props.dispatch(saveAppStateAction({ tabBar: true }))
      Actions.tabBar();
    });
  }

  login = () => {
    const auth = firebase.auth();
    const provider = firebase.auth.FacebookAuthProvider;
      AccessToken.getCurrentAccessToken()
      .then((accessTokenData) => {
        console.log('got accesTok')
        const credential = provider.credential(accessTokenData.accessToken);
        return auth.signInWithCredential(credential);
      })
      .then((credData) => {
        console.log('got credData');
        this.checkIfExistingUser(credData);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
  return (
    <View style={styles.containerView}>
      <Image style={styles.logo} source={Wingman} />
      <Text style={styles.headerText}>Meet your future wingman today</Text>
      <Text style={styles.paragraph}> Find the wingmans that are best for your own personality and availability.</Text>
      <View style={styles.loginButtonView}>
        <LoginButton onLoginFinished={this.login} />
      </View>
    </View>
  );
  }
}


export default connect(mapStateToProps)(Login);
