/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */
 import React, { Component } from 'react';
 import {
   AppRegistry,
   StyleSheet,
   Text,
   View,
 } from 'react-native';
 import App from './app/index.js';
//  import * as firebase from 'firebase';
//  // const firebaseConfig = {
//  //   apiKey: 'AIzaSyDrQpV3-mc6-hGGJAroP9le4boFeHrG1aM',
//  //   authDomain: 'wingman-f33a2.firebaseapp.com',
//  //   databaseURL: 'https://wingman-f33a2.firebaseio.com',
//  //   storageBucket: 'wingman-f33a2.appspot.com',
//  // };
//  // const firebaseApp = firebase.initializeApp(firebaseConfig);
//
//
// // <script src="https://www.gstatic.com/firebasejs/4.1.1/firebase.js"></script>
// // <script>
//   // Initialize Firebase
//   var config = {
//     apiKey: "AIzaSyDrQpV3-mc6-hGGJAroP9le4boFeHrG1aM",
//     authDomain: "wingman-f33a2.firebaseapp.com",
//     databaseURL: "https://wingman-f33a2.firebaseio.com",
//     projectId: "wingman-f33a2",
//     storageBucket: "wingman-f33a2.appspot.com",
//     messagingSenderId: "118390179615"
//   };
//   firebase.initializeApp(config);
// </script>

export default class humanConnection extends Component {
  render() {
    return (
      <App />
    );
  }
}

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

AppRegistry.registerComponent('humanConnection', () => humanConnection);
