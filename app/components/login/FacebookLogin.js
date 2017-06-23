import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import { View, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { connect } from 'react-redux';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo';
import { saveAppStateAction } from '../../redux/modules/saveAppState';

const styles = StyleSheet.create({
  view: {
    height: 200,
    width: 300,
  },
});

import * as firebase from 'firebase';
// // const firebaseConfig = {
// //   apiKey: 'AIzaSyDrQpV3-mc6-hGGJAroP9le4boFeHrG1aM',
// //   authDomain: 'wingman-f33a2.firebaseapp.com',
// //   databaseURL: 'https://wingman-f33a2.firebaseio.com',
// //   storageBucket: 'wingman-f33a2.appspot.com',
// // };
// // const firebaseApp = firebase.initializeApp(firebaseConfig);
//
//
// // <script src="https://www.gstatic.com/firebasejs/4.1.1/firebase.js"></script>
// // <script>
//  // Initialize Firebase
 var config = {
   apiKey: "AIzaSyDrQpV3-mc6-hGGJAroP9le4boFeHrG1aM",
   authDomain: "wingman-f33a2.firebaseapp.com",
   databaseURL: "https://wingman-f33a2.firebaseio.com",
   projectId: "wingman-f33a2",
   storageBucket: "wingman-f33a2.appspot.com",
   messagingSenderId: "118390179615"
 };
 firebase.initializeApp(config);

export class Login extends Component {

  checkIfExistingUser(facebookData) {
    const that = this
    firebase.database().ref(`users/${facebookData.uid}`).once('value').then(function(data) {
      if (data.val().age) {
        that.goToTabMenu(facebookData.uid);
      } else {
        const saveUserData = { name: facebookData.displayName,
          profile_picture: facebookData.photoURL,
          id: facebookData.uid };
        firebase.database().ref(`users/${facebookData.uid}`).set(saveUserData).then(
          that.handleNewUser(saveUserData),
        );
      }
    });
  }

  componentDidMount() {
    const auth = firebase.auth();
    const provider = firebase.auth.FacebookAuthProvider;
    LoginManager.logInWithReadPermissions(['public_profile'])
    .then((loginResult) => {
      if (loginResult.isCancelled) {
        console.log('user canceled');
        return;
      }
      AccessToken.getCurrentAccessToken()
      .then((accessTokenData) => {
        const credential = provider.credential(accessTokenData.accessToken);
        return auth.signInWithCredential(credential);
      })
      .then((credData) => {
        this.checkIfExistingUser(credData);
      })
      .catch((err) => {
        console.log(err);
      });
    });
  }

  goToUserSetup() {
    Actions.createProfile();

  }

  handleNewUser(saveData) {
    this.saveToRedux(saveData);
    this.goToUserSetup();
  }

  saveToRedux = (saveData) => {
    return this.props.dispatch(saveUserInfoAction(saveData))
  }

  goToTabMenu = (id) => {
    const that = this;
    firebase.database().ref(`users/${id}`).once('value').then((data) => {
        that.saveToRedux(data.val());
        that.props.dispatch(saveAppStateAction({ tabBar: true }))
        Actions.tabBar();
      })

  }

  render() {
  return (
    <View>
    <LoginButton
      publishPermissions={["publish_actions"]}
      readPermissions={['public_profile']}
      onLoginFinished={
        (error, result) => {
          if (error) {
            alert("Login failed with error: " + result.error);
          } else if (result.isCancelled) {
            alert("Login was cancelled");
          } else {
            this.checkIfExistingUser()
            // AccessToken.getCurrentAccessToken().then(
            //       (data) => {
            //         alert(data.accessToken.toString())
            //       }
            //     )
            // AccessToken.getCurrentAccessToken().then((data) => {
            //    const { accessToken } = data
            //    initUser(accessToken)
            //  })

            alert("Login was successful with permissions: " + result.grantedPermissions)
          }
        }
      }
      onLogoutFinished={() => alert("User logged out")}
      onLoginFound={function(data){
         console.log("Existing login found.");
         console.log(data);
         _this.setState({ user : data.credentials });
       }}
       onLoginNotFound={function(){
            console.log("No user logged in.");
            _this.setState({ user : null });
          }}
        />
    </View>
  );
  }
}

const mapStateToProps = (store) => ({
  reduxStoreProps: store,
});

export default connect(mapStateToProps)(Login);


// function setBandMessageAsync() {
// return dispatch => {
//   return new Promise((resolve) => {
//     clearTimeout(timer);
//     timer = setTimeout(() => {
//       resolve(payload);
//     }, 1000);
//   }).then(result => {
//     dispatch(saveMessageAction(result));
//   });
//
// var Login = React.createClass({
//   render: function() {
//     return (
//       <View>
//         <LoginButton
//           publishPermissions={["publish_actions"]}
//           onLoginFinished={
//             (error, result) => {
//               if (error) {
//                 alert("Login failed with error: " + result.error);
//               } else if (result.isCancelled) {
//                 alert("Login was cancelled");
//               } else {
//                 alert("Login was successful with permissions: " + result.grantedPermissions)
//               }
//             }
//           }
//           onLogoutFinished={() => alert("User logged out")}/>
//       </View>
//     );
//   }
// });
