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
import getUserRow from '../common/userRow';
import { mapStateToProps } from '../common/functions';
import { Actions } from 'react-native-router-flux';
import UserRow from '../common/userRow';

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
      firebase.database().ref(`${this.props.city}/${start}`)
      .once('value').then((data) => {
        console.log(data.val())
        for (const key in data.val()) {
          console.log('inside');
          // if !key in matchedUsers
          if (!matchedUsers.includes(key)) {
        //  if (matchedUsers.filter(key).length === 0) {
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
      // const newDate = start.setDate(start.getDate() + 1);
      // start = new Date(newDate);
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

  getUsers = (matchedUsers) => {
    console.log(matchedUsers);
    const userProfiles = [];
    matchedUsers.forEach((user) => {
      firebase.database().ref(`users/${user}`).once('value').then((userInfo) => {
        const matchedRequests = userInfo.val().requests;
        let info = userInfo.val()
        let ifAdd = true;
        for (const key in matchedRequests) {
          if (matchedRequests[key].id === this.props.reduxStoreProps.user.id) {
            console.log('in im');
            ifAdd = false;

            info.invited = true;
          }
        }
        console.log(info)
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
          <UserRow user={profile} key={profile.id} sendInvite={this.sendInvite} />) : null }
      </View>);
  }
}

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
