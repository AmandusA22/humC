import { View, ScrollView, StyleSheet, Text, Image, TouchableHighlight, ListView } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Header from '../common/Header';
import { unixToShortDate, mapStateToProps, getUsersChats } from '../common/functions';
import UserRow from '../common/userRow';

const styles = StyleSheet.create({
  userImage: { height: 100,
    width: 100,
    borderRadius: 50,
    marginTop: 20,
    marginHorizontal: 8,
  },
  rowContainer: {
    flex: 1,
    marginTop: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  unseenMessagesView: {
    left: 80,
    top: 15,
    position: 'absolute',
    borderRadius: 50,
    padding: 7,
    width: 32,
    height: 32,
    backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
  },
  unseenMessagesText: {
    color: 'white',
    fontSize: 18,
  },
  rowHeaderText: {
    fontSize: 14,
  },
});

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
    getUsersChats(us.id).then(ourChats => this.setState({ ourChats }))
  // .then(ourChats =>
    //   //this.getUnseenMessagesForChats(ourChats)
    // );
  }

  // getUnseenMessagesForChats = (ourChats) => {
  //   if (!ourChats) {
  //     return;
  //   }
  //   ourChats.forEach((chat) => {
  //     const chatId = chat.chatId;
  //     const us = this.props.reduxStoreProps.user;
  //     firebase.database().ref(`chats/${chatId}/${us.id}`).on('value');
  //   },
  // );
  // }

  getRequests() {
    console.log('in getRequests');
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

  removeRequest = (them) => {
    const us = this.props.reduxStoreProps.user;
    firebase.database().ref(`users/${them.id}/sentinvites/${us.id}`).remove();
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
    if (!this.state.ourChats) {
      return;
    }

    this.state.ourChats.forEach((chat) => {
      if (chat.favorite) {
        favorites.push(chat);
      } else if (chat.end < new Date().getTime()) {
        expired.push(chat);
      } else {
        scheduledChats.push(chat);
      }
    });
    const datesWithChats = []
    scheduledChats.forEach((scheduledChat) => {
      const included = datesWithChats.filter(chatDate => chatDate.start === scheduledChat.start);
      if (included.length === 0) {
        datesWithChats.push({ start: scheduledChat.start, end: scheduledChat.end, city: scheduledChat.city, chats: [scheduledChat] });
      } else {
        included.chats.push(scheduledChat);
      }
    });
    return (
      <View>
        {favorites.length !== 0 ? this.getRow(favorites, 'Favorites') : null}
        {datesWithChats.map(date => this.getRow(date.chats, `${unixToShortDate(date.start)} - ${unixToShortDate(date.end)} - ${date.city}`))}
      </View>
    );
  }

  getRow = (users, text) => {
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    const dataSource = ds.cloneWithRows(users);
    return (
      <View style={styles.rowContainer}>
         <View>
           <Text style={styles.rowHeaderText}>
             {text}
           </Text>
         </View>
        <ListView
          horizontal
          dataSource={dataSource}
          renderRow={user =>
            <TouchableHighlight index={user.id} onPress={() => this.goToChat(user)}>
              <View>
                <Image source={{ uri: user.image }} style={styles.userImage} />
                {user.unseen > 0 ? <View style={styles.unseenMessagesView}><Text style={styles.unseenMessagesText}>{user.unseen}</Text></View> : null}
              </View>
            </TouchableHighlight>}
        />
      </View>
    );
  }

  acceptInvite = (requestInfoFromThem) => {
    const us = this.props.reduxStoreProps.user;
    const chatInfoForUs = {
      image: requestInfoFromThem.image,
      id: requestInfoFromThem.id,
      city: requestInfoFromThem.city,
      name: requestInfoFromThem.name,
      chatId: `${us.id}${requestInfoFromThem.id}`,
      start: requestInfoFromThem.invitedUsersFirstAvailableDay,
      end: requestInfoFromThem.invitedUsersLastAvailableDay,
    };
    const chatInfoForThem = {
      image: us.image,
      id: us.id,
      city: requestInfoFromThem.city,
      name: us.name,
      chatId: `${us.id}${requestInfoFromThem.id}`,
      start: requestInfoFromThem.invitingUsersFirstAvailableDay,
      end: requestInfoFromThem.invitingUsersLastAvailableDay,
    };
    const chatRefUs = firebase.database().ref(`users/${us.id}/chats/${requestInfoFromThem.id}`);
    const chatRefThem = firebase.database().ref(`users/${requestInfoFromThem.id}/chats/${us.id}`);
    chatRefThem.set(chatInfoForThem)
    .then(() => chatRefUs.set(chatInfoForUs)
    .then(() => {
      this.removeRequest(requestInfoFromThem);
      getUsersChats(us.id).then(ourChats => this.setState({ ourChats }));
    }),
    );
  };

  goToChat = (user) => {
    console.log(user);
    Actions.chat({ user });
  }

  render() {
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
