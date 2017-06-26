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

class SearchWingman extends Component {

  constructor(props) {
    super(props);
    this.people = [{ description: 'hi', age: 27, gender: 'Male', interest: 'women' }];
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
    let start = this.props.start;
    const end = this.props.end;
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
      const newDate = start.setDate(start.getDate() + 1);
      start = new Date(newDate);
    }
  }

  sendInvite = (id) => {
    const user = this.props.reduxStoreProps.user;
    const relevantUserInfo = {
      interest: user.interest,
      name: user.name,
      match: {[ new Date(this.props.start).getTime()]: {[new Date(this.props.end).getTime()] : this.props.city }},
      age: user.age,
      gender: user.gender,
      image: user.image,
      description: user.description,
      id: user.id
    };
    console.log(relevantUserInfo)

    firebase.database().ref(`users/${id}/requests/${user.id}`).set(relevantUserInfo)
  //  newRef.set()
  }

  getUsers = (matchedUsers) => {
    console.log(matchedUsers);
    const userProfiles = [];
    matchedUsers.forEach((user) => {
      firebase.database().ref(`users/${user}`).once('value').then((userInfo) => {
        userProfiles.push(userInfo.val());
        this.setState({ userProfiles });
      });
    });
  }
  renderHeader = () => {
    return(
      <Header variant="transparent" title="Matches" left={
      <TouchableHighlight>
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
          <View style={{ flexDirection: 'row', height: 110 }}>
            <Image style={{ height: 100, width: 100 }} source={{ uri: profile.image }} />
            <View>
              <Text>{profile.name} is a {profile.age} year old {profile.gender} with an interest in
              {profile.interest} he would describe himself as {profile.description}
              </Text>
            <Button onPress={() => this.sendInvite(profile.id)}>
              Invite
            </Button>
            </View>
          </View>,
        ) : null }
      </View>);
  }
}

export default connect(mapStateToProps)(SearchWingman);
