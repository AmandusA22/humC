import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableHighlight,
} from 'react-native';
import * as firebase from 'firebase';
import { includes } from 'lodash';
import Button from 'react-native-button';
import BackIcon from '../../images/back-icon.png';
import Header from '../common/Header';
import { connect } from 'react-redux';
import { mapStateToProps } from '../common/functions';
import { Actions } from 'react-native-router-flux';
import UserRow from '../common/userRow';
import { unixToShortDate } from '../common/functions';

class SearchWingman extends Component {

  constructor(props) {
    super(props);
    this.state = {
      availableUsers: null,
      userProfiles: null,
      chats: [],
      invites: [],
    };
  }

  componentDidMount() {
    this.getAvailableUsers();
    this.getOurChats();
    this.getOurSentInvites();
  }

  getAvailableUsers() {
    console.log('start', this.props.start);
    console.log('end', this.props.end);
    let ourNextSearchDayUnix = new Date(+this.props.start).getTime()
    const ourLastDayUnix = new Date(+this.props.end).getTime();
    const availableUsers = [];
    const that = this;
    console.log('nextSearchDat', ourNextSearchDayUnix);
    console.log('lastDay', ourLastDayUnix);
    while (ourNextSearchDayUnix <= ourLastDayUnix) {
      const oneAvailableDay = unixToShortDate(ourNextSearchDayUnix);
      firebase.database().ref(`${this.props.city}/${oneAvailableDay}`)
      .once('value').then((rawUser) => {
        const user = rawUser.val();
        for (const userId in user) {
          // if (!availableUsers.includes(user)) {
          availableUsers[userId] = user[userId];
          that.setState(() => {
            this.getAvailableUsersInfo(availableUsers);
            return { availableUsers };
          });
        }
      });
      ourNextSearchDayUnix += 1000 * 60 * 60 * 24;
    }
  }

  getOurChats = () => {
    const us = this.props.reduxStoreProps.user;
    const ourChatsRef = firebase.database().ref(`users/${us.id}/chats`);
    ourChatsRef.on('value', (chatsRaw) => {
      const chats = chatsRaw.val();
      const chatUsers = [];
      for (const userId in chats) {
        chatUsers.push(userId);
      }
      //chats.push(chat.val());
      this.setState({ chats: chatUsers });
    });
  }

  getOurSentInvites = () => {
    console.log('in getting requests');
    const us = this.props.reduxStoreProps.user;
    console.log(us.id);
    const ourSentInvitesRef = firebase.database().ref(`users/${us.id}/sentinvites`);
    ourSentInvitesRef.on('value', (invitesRaw) => {
      const invites = invitesRaw.val()

      const invitesArr = [];
      for (const userId in invites) {
        invitesArr.push(userId)
      }
      this.setState({ sentinvites: invitesArr });
    });
  }

  getAvailableUsersInfo = (availableUsers) => {
    const userProfiles = [];
    for (const userId in availableUsers) {
      firebase.database().ref(`users/${userId}`).once('value').then((userInfoRaw) => {
        const userInfo = userInfoRaw.val();
        const relevantUserInfo = {
          image: userInfo.image,
          usersFirstAvailableDay: availableUsers[userId].start,
          usersLastAvailableDay: availableUsers[userId].end,
          id: userId,
          name: userInfo.name,
          description: userInfo.description,
          interest: userInfo.interest,
          age: userInfo.age,
        };
        const ourSentInvites = this.state.sentinvites;
        console.log(ourSentInvites);
        ourSentInvites.forEach((id) => {
          if (id === userId) {
            console.log('invited true');
            relevantUserInfo.invited = true;
          }
        });
        const ourChats = this.state.chats;
        console.log(ourChats);
        ourChats.forEach((id) => {
          console.log(id);
          if (id === userId) {
            relevantUserInfo.chatting = true;
            console.log('chatting true');
          }
        },
      );
        // console.log(info);
        userProfiles.push(relevantUserInfo);
        this.setState({ userProfiles });
      });
    }
  }

  uninvite = (id) => {
    const user = this.props.reduxStoreProps.user;
    firebase.database().ref(`users/${id}/requests/${user.id}`).remove();
    firebase.database().ref(`users/${user.id}/sentinvites/${id}`).remove();
  }

  sendInvite = (them) => {
    const id = them.id;
    const us = this.props.reduxStoreProps.user;
    const start = unixToShortDate(this.props.start);
    const end = unixToShortDate(this.props.end);
    const relevantUserInfo = {
      interest: us.interest,
      name: us.name,
      invitingUsersFirstAvailableDay: start,
      invitingUsersLastAvailableDay: end,
      invitedUsersFirstAvailableDay: them.usersFirstAvailableDay,
      invitedUsersLastAvailableDay: them.usersLastAvailableDay,
      city: this.props.city,
      age: us.age,
      gender: us.gender,
      image: us.image,
      description: us.description,
      id: us.id,
    };
    firebase.database().ref(`users/${id}/requests/${us.id}`).set(relevantUserInfo);
    firebase.database().ref(`users/${us.id}/sentinvites/${id}`).set(true);
  }

  backToCalendar() {
    return Actions.pop();
  }

  renderHeader = () => {
    return (
      <Header variant="transparent" title="Matches" left={
        <TouchableHighlight onPress={() => this.backToCalendar()}>
          <Image source={BackIcon} />
        </TouchableHighlight>
    } />
    );
  }

  render() {
    return (
      <View>
        {this.renderHeader()}
        {this.state.userProfiles ? this.state.userProfiles.map(profile =>
          <UserRow user={profile} key={profile.id} uninvite={this.uninvite} sendInvite={this.sendInvite} />)
           : null }
      </View>);
  }
}

export default connect(mapStateToProps)(SearchWingman);
