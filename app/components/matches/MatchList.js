
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
    this.state = {
      unrespondedChatRequests: [],
      ourChats: [] };
  }

  componentDidMount() {
    this.getRequests();
    const us = this.props.reduxStoreProps.user;
    getUsersChats(us.id).then(ourChats => this.setState({ ourChats })).then(ourChats =>
      this.getUnseenMessagesForChats(ourChats)
    );
  }

  getUnseenMessagesForChats = (ourChats) => {
    ourChats.forEach((chat) => {
      const chatId = chat.chatId;
      const us = this.props.reduxStoreProps.user;
      firebase.database.ref(`chats/${chatId}/${us.id}`).on('value');
    },
  );
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

  acceptInvite = (requestInfoFromThem) => {
    console.log(requestInfoFromThem);
    const us = this.props.reduxStoreProps.user;
    const chatInfoForUs = { image: requestInfoFromThem.image, id: requestInfoFromThem.id, city: requestInfoFromThem.city, name: requestInfoFromThem.name, chatId: `${us.id}${requestInfoFromThem.id}`, start: requestInfoFromThem.invitedUsersFirstAvailableDay, end: requestInfoFromThem.invitedUsersLastAvailableDay};
    const chatInfoForThem = { image: us.image, id: us.id, city: requestInfoFromThem.city, name: us.name, chatId: `${us.id}${requestInfoFromThem.id}`, start: requestInfoFromThem.invitingUsersFirstAvailableDay, end: requestInfoFromThem.invitingUsersLastAvailableDay };
    const chatRefUs = firebase.database().ref(`users/${us.id}/chats/${requestInfoFromThem.id}`);
    const chatRefThem = firebase.database().ref(`users/${requestInfoFromThem.id}/chats/${us.id}`);
    console.log(chatInfoForUs);
    console.log(chatInfoForThem);
    chatRefThem.set(chatInfoForThem).then(() =>
      chatRefUs.set(chatInfoForUs).then(() => {
        this.removeRequest(requestInfoFromThem);
        getUsersChats(us.id).then(chats => this.setState({ chats }));
      }),
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
    const scheduledChats = [];
    const favorites = [];
    const expired = [];

    this.state.ourChats.forEach((chat) => {
      console.log(chat);
      if (chat.favorite) {
        console.log('favorites');
        favorites.push(chat);
      } else if (chat.end < new Date().getTime()) {
        console.log('expired');
        expired.push(chat);
      } else {
        console.log('scheduledChats');
        scheduledChats.push(chat);
      }
    });
    const datesWithChats = []
    scheduledChats.forEach((scheduledChat) => {
      console.log('in schedule for each');
      const included = datesWithChats.filter(chatDate => chatDate.start === scheduledChat.start);
      console.log(included)
      if (included.length === 0) {
        console.log('in dates with chat');
        datesWithChats.push({ start: scheduledChat.start, end: scheduledChat.end, city: scheduledChat.city, chats: [scheduledChat] });
      } else {
        console.log('in included');
        included.chats.push(scheduledChat);
      }
    });
    return (
      <View>
        {favorites.length !== 0 ? this.getRow(favorites, 'Favorites') : null}
        {datesWithChats.map(date => this.getRow(date.chats, `${unixToShortDate(date.start)} - ${unixToShortDate(date.end)} - ${date.city}`))}
      </View>
    )

  //  return (
  //    <View key={index} style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
  //      <View>
  //        <Text style={{ fontSize: 14 }}>
  //          {`${unixToShortDate(dateValues.start)} - ${unixToShortDate(dateValues.end)} - ${dateValues.city}`}
  //        </Text>
  //      </View>
  //      <ListView
  //        horizontal
  //        dataSource={dataSource}
  //        renderRow={user =>
  //          <TouchableHighlight key={index} onPress={() => this.goToChat(user)}>
  //            <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20, marginHorizontal: 8 }} />
  //          </TouchableHighlight>}
  //      />
  //    </View>

    // const favoritesRow =
    //   <View>
    //     <Text>Favorites</Text>
    //
    //     </View>

    console.log(datesWithChats);


    console.log('scheduledChats', scheduledChats);
    console.log('favorites', favorites);
    console.log('expired', expired);
  }

  getRow = (users, text) => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(users);
    return (
      <View style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
         <View>
           <Text style={{ fontSize: 14 }}>
             {text}
           </Text>
         </View>
         <ListView
           horizontal
           dataSource={dataSource}
           renderRow={user =>
             <TouchableHighlight onPress={() => this.goToChat(user)}>
               <View>
               <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20, marginHorizontal: 8 }} />
                {user.unseen > 0 ? <View style={{ left: 80, top: 15, position: 'absolute', borderRadius: 50, padding: 7, width: 32, height: 32, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center' }}><Text style={{color: 'white', fontSize: 18}}>{user.unseen}</Text></View> : null}

               </View>
             </TouchableHighlight>}
         />
      </View>
   )
  }

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
    console.log(user);
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
