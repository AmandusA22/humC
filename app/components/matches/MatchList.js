
import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import { View, ScrollView, StyleSheet, Text, Image, TouchableHighlight, ListView } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo';
import { saveAppStateAction } from '../../redux/modules/saveAppState';
import Header from '../common/Header';
import { ifURL } from '../common/functions';

import { unixToShortDate, mapStateToProps, getUsersChats } from '../common/functions';
import UserRow from '../common/userRow';

class MatchList extends Component {
  constructor() {
    super();
    this.state = { unrespondedChatRequests: [] };
  }

  componentDidMount() {
    this.getRequests();
    const us = this.props.reduxStoreProps.user;
    getUsersChats(us.id).then(ourChats => this.setState({ ourChats }));
  }

  getRequests() {
    this.setState({
      unrespondedChatRequests: [],
    });
    const us = this.props.reduxStoreProps.user;
    const requeststRef = firebase.database().ref(`users/${us.id}/requests`);
    requeststRef.on('value', (request) => {
      console.log('in request');
      if (request.val() == null) {
        this.setState({ unrespondedChatRequests: [] });
        console.log(this.state.unrespondedChatRequests);
      } else if (this.state.unrespondedChatRequests.length > 1) {
        const req = this.state.unrespondedChatRequests.push(request.val());
        this.setState({ unrespondedChatRequests: req });
      } else {
        this.setState({ unrespondedChatRequests: [request.val()] });
      }
    });
  }
//
  // requestList() {
  //   const id = this.props.reduxStoreProps.user.id;
  //
  //   const requeststRef = firebase.database().ref(`users/${id}/availability`);
  //   requeststRef.on('value', (availability) => {
  //     console.log('got req');
  //     this.setState((state) => { unrespondedChatRequests: state.unrespondedChatRequests.push(availability.val()); }
  //       // state.unrespondedChatRequests.push(request.val())
  //   );
  //   });
  // }

  acceptInvite = (them) => {
    console.log(them);
    const us = this.props.reduxStoreProps.user;
    console.log(us);
    const chatInfoForUs = { image: them.image, name: them.name, chatId: `${us.id}${them.id}`, start: them.invitedUsersFirstAvailableDay, end: them.invitedUsersLastAvailableDay};
    const chatInfoForThem = { image: us.image, name: us.name, chatId: `${us.id}${them.id}`, start: them.invitingUsersFirstAvailableDay, end: them.invitingUsersLastAvailableDay };
    const chatRefUs = firebase.database().ref(`users/${us.id}/chats/${them.id}`);
    const chatRefThem = firebase.database().ref(`users/${them.id}/chats/${us.id}`);
    console.log(chatInfoForUs);
    console.log(chatInfoForThem);
    chatRefThem.set(chatInfoForThem).then(() =>
       chatRefUs.set(chatInfoForUs).then(() =>
        getUsersChats(us.id).then(chats => this.setState({ chats }))),
    );
  };

  removeRequest = (them) => {
    const us = this.props.reduxStoreProps.user;
    firebase.database().ref(`users/${us.id}/requests/${them.id}`).remove().then(this.getRequests());
  }

  renderRequests() {
    console.log(this.state.unrespondedChatRequests);
    if (this.state.unrespondedChatRequests.length <= 0) { return; }
    return (
      <View>
        <Text style={{ fontSize: 18, alignSelf: 'center' }}>Chat invitations</Text>
        {this.state.unrespondedChatRequests.map((user, index) => {
          let profile;
          for (var key in user) {
            profile = user[key];
          }
          if (!profile) {
            return;
          }
          return (
            <UserRow
              key={index}
              user={profile}
              key={profile.id}
              accept={this.acceptInvite}
              decline={this.removeRequest}
            />
          );
        },
        )
        }
      </View>);
  }

  renderChatDates = () => {
    console.log(this.state.ourChats);
    const chatDates = [];
    this.state.ourChats.forEach((chat) => {
      const included = chatDates.filter(chatDate => chatDate.start === chat.start);

      if (!included) {
        chatDates.push({ start: chat.start, end: chat.end });
      }
    });

    // const dates = [];
    // const availability = this.state.availability;
    // console.log(availability);
    // for (var key in availability) {
    //   dates.push({ [key]: availability[key] });
    // }
    // return (dates.map((date, index) => {
    //   console.log(date);
    //   let dateValues;
    //   for (const key in date) {

    //     dateValues = date[key];
    //   }
    //   let users = [];
    //   const chats = dateValues.chat
    //   for (const key in chats) {
    //     users.push(chats[key]);
    //   }
    //   if (!chats) {
    //     return;
    //   }
    //   const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    //   const dataSource = ds.cloneWithRows(users)
    //   return (
    //     <View key={index} style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
    //       <View>
    //         <Text style={{ fontSize: 14 }}>
    //           {`${unixToShortDate(dateValues.start)} - ${unixToShortDate(dateValues.end)} - ${dateValues.city}`}
    //         </Text>
    //       </View>
    //       <ListView
    //         horizontal
    //         dataSource={dataSource}
    //         renderRow={user =>
    //           <TouchableHighlight key={index} onPress={() => this.goToChat(user)}>
    //             <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20, marginHorizontal: 8 }} />
    //           </TouchableHighlight>}
    //       />
    //     </View>
    //   ) }))
  }
  //
  // <ScrollView contentInset={{ bottom: 64 }} horizontal={true} showsVerticalScrollIndicator={false}>
  //   {users ? users.map((user, index) => {
  //     console.log(user.image);
  //   return(
  //     <TouchableHighlight key={index} onPress={() => this.goToChat(user)}>
  //
  //       <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20, marginHorizontal: 8 }} />
  //
  //     </TouchableHighlight>
  //   )
  // }) : null}
  // </ScrollView>


  // <View>
  //   <Text style={{ fontSize: 14 }}>
  //     {`${unixToShortDate(dateValues.start)} - ${unixToShortDate(dateValues.end)} - ${dateValues.city}`}
  //   </Text>
  // </View>
  // <ScrollView contentInset={{ bottom: 64 }}>
  //   {users ? users.map((user, index) => {
  //   return(
  //     <TouchableHighlight key={index} onPress={() => this.goToChat(user)}>
  //       {ifURL(user.image) ?
  //       <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20 }} />
  //       : null}
  //     </TouchableHighlight>
  //   )
  // }) : null}
  // </ScrollView>

  removeDatesAlert = (start) => {

  }

  removeDates = (start) => {

  }

  goToChat = (user) => {
    Actions.chat({ user });
  }

  render() {
    console.log('rendering')
    return (
      <ScrollView>
        <Header variant="transparent" title="Chats" />
        <View>
          {this.renderRequests()}
        </View>
        <View>
          {this.renderChatDates()}
        </View>
      </ScrollView>);
  }
}

export default connect(mapStateToProps)(MatchList);
//
// .once('value').then((rawUser) => {
//   const users = rawUser.val()
//   for (const userId in users) {
//     console.log(rawUser.val()[userId])
//     //if (!availableUsers.includes({[userId]: users[userId]})) {
//       availableUsers[userId] = users[userId];
//       that.setState(() => {
//         this.getUsers(availableUsers);
//         return { availableUsers };
//       });
//     }
// //  }
// });
// ourFirstUnsearchedDayUnix += 1000 * 60 * 60 * 24;
// }
