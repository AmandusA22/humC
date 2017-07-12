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
      matchedUsers: null,
      userProfiles: null,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  loadData() {
    console.log(this.props.start);
    let start = new Date(+this.props.start).getTime()
    const end = new Date(+this.props.end).getTime();
    console.log(this.props.city);
    const matchedUsers = [];
    const that = this;
    while(start < end) {
      console.log('loading');
      const date = unixToShortDate(start);
      firebase.database().ref(`${this.props.city}/${date}`)
      .once('value').then((data) => {
        console.log(data.val())
        for (const key in data.val()) {
          if (!matchedUsers.includes(key)) {
            matchedUsers.push(key);
            console.log(matchedUsers);
            that.setState(() => {
              this.getUsers(matchedUsers);
              return { matchedUsers };
            });
          }
        }
      });
      start += 1000 * 60 * 60 * 24;
    }
  }

  sendInvite = (id) => {
    const user = this.props.reduxStoreProps.user;
    const start = new Date(this.props.start).getTime();
    const end = new Date(this.props.end).getTime();
    const relevantUserInfo = {
      interest: user.interest,
      name: user.name,
      start,
      end,
      city: this.props.city,
      age: user.age,
      gender: user.gender,
      image: user.image,
      description: user.description,
      id: user.id,
    };
    firebase.database().ref(`users/${id}/requests/${user.id}`).set(relevantUserInfo);
    firebase.database().ref(`users/${user.id}/invites/${id}`).set({ occupied: true });
  }

  uninvite = (id) => {
    const user = this.props.reduxStoreProps.user;
    firebase.database().ref(`users/${id}/requests/${user.id}`).remove();
    firebase.database().ref(`users/${user.id}/invites/${id}`).remove();
  }

  getUsers = (matchedUsers) => {
    console.log(matchedUsers);
    const userProfiles = [];
    matchedUsers.forEach((user) => {
      firebase.database().ref(`users/${user}`).once('value').then((userInfo) => {
        console.log('iterating')
        const matchedRequests = userInfo.val().requests;
        let info = userInfo.val();
        let ifAdd = true;
        console.log(info.id)
      //  console.log(info.id);
        for (const key in matchedRequests) {
          // console.log(info.availability[this.props.start].chat);
          // console.log(matchedRequests[key].id)
          if(info.availability[this.props.start].chat[matchedRequests[key].id]) {
            console.log('its a match');
          }
          if (matchedRequests[key].id === this.props.reduxStoreProps.user.id) {
            //ifAdd = false;
            info.invited = true;
            //break;
          }
          if (info.availability[this.props.start].chat[matchedRequests[key].id]) {
            info.chatting = true;
            break;
          }
        }
        console.log(info);
        userProfiles.push(info);
        this.setState({ userProfiles });
      });
    });
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
    return(
      <Header variant="transparent" title="Matches" left={
      <TouchableHighlight onPress={() => this.backToCalendar()}>
        <Image source={BackIcon}></Image>
      </TouchableHighlight>

    } />
    )
  }

  render() {
    console.log('in searchWingman');
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
