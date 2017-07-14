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
    };
  }

  componentDidMount() {
    this.getAvailableUsers();
  }

  getAvailableUsers() {
    let ourNextSearchDayUnix = new Date(+this.props.start).getTime()
    const ourLastDayUnix = new Date(+this.props.end).getTime();
    console.log(this.props.city);
    const availableUsers = [];
    const that = this;
    while(ourNextSearchDayUnix < ourLastDayUnix) {
      console.log('loading');
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

  sendInvite = (them) => {
    console.log(them);
    const id = them.id;
    const us = this.props.reduxStoreProps.user;
    const start = new Date(this.props.start).getTime();
    const end = new Date(this.props.end).getTime();
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
    firebase.database().ref(`users/${us.id}/invites/${id}`).set({ occupied: true });
  }

  uninvite = (id) => {
    const user = this.props.reduxStoreProps.user;
    firebase.database().ref(`users/${id}/requests/${user.id}`).remove();
    firebase.database().ref(`users/${user.id}/invites/${id}`).remove();
  }

  getAvailableUsersInfo = (availableUsers) => {
    console.log(availableUsers);
    const userProfiles = [];
    for (const userId in availableUsers) {

      firebase.database().ref(`users/${userId}`).once('value').then((userInfoRaw) => {
        const userInfo = userInfoRaw.val();
        console.log(userInfo);

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

        // console.log(info);
        userProfiles.push(relevantUserInfo);
        this.setState({ userProfiles });
      });
    }
  }

  backToCalendar() {
    if (this.props.reduxStoreProps.app_state.tabBar) {
      return Actions.CalendarTab()
    }
    // else
    Actions.calendar();
  }

  renderHeader = () => {
    console.log(this.props.reduxStoreProps)
    return (
      <Header variant="transparent" title="Matches" left={
        <TouchableHighlight onPress={() => this.backToCalendar()}>
          <Image source={BackIcon} />
        </TouchableHighlight>
    } />
    );
  }

  render() {
    console.log('in searchWingman');
    console.log(this.props);
    return (
      <View>
        {this.renderHeader()}
        {this.state.userProfiles ? this.state.userProfiles.map(profile =>
          <UserRow user={profile} key={profile.id} uninvite={this.uninvite} sendInvite={this.sendInvite} />)
           : null }
      </View>);
  }
}
//<UserRow user={profile} key={profile.id} sendInvite={this.sendInvite} />)
// {this.renderHeader()}
// {this.state.userProfiles ? this.state.userProfiles.map(profile =>
//   <UserRow user={profile} key={profile.id} sendInvite={this.sendInvite} />) : null }

// <View style={{ flexDirection: 'row', height: 110 }}>
//   <Image style={{ height: 100, width: 100 }} source={{ uri: profile.image }} />
//   <View>
//     <Text>{profile.name} is a {profile.age} year old {profile.gender} with an interest in
//     {profile.interest} he would describe himself as {profile.description}
//     </Text>
//   <Button onPress={() => this.sendInvite(profile.id)}>
//     Invite
//   </Button>
//   </View>
// </View>,
export default connect(mapStateToProps)(SearchWingman);
