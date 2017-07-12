
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

import { unixToShortDate, mapStateToProps, getAvailabilityArray } from '../common/functions';
import UserRow from '../common/userRow';

class MatchList extends Component {
  constructor() {
    super();
    this.state = { requestUsers: [] };
  }

  componentDidMount() {
    this.getRequests();
    getAvailabilityArray(`${this.props.reduxStoreProps.user.id}`).then(availability => this.setState({ availability }));
    // console.log('in component did mount');
    // const id = this.props.reduxStoreProps.user.id;
    // const requeststRef = firebase.database().ref('users/' + id);
    // requeststRef.on('child_changed', () => {
    //   this.getRequests();
    // })
  }

  getRequests() {
    this.setState({
      requestUsers: [],
    });
    const id = this.props.reduxStoreProps.user.id;
    const requeststRef = firebase.database().ref(`users/${id}/requests`);
    requeststRef.on('value', (request) => {
      console.log('in request');
      if (request.val() == null) {
        this.setState((state) => { requestUsers: [] });
        console.log(this.state.requestUsers);
      } else {
        const requests = [];
        console.log(request.val());
        console.log(this.state.requestUsers);
        this.setState({requestUsers: [request.val()]})
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
  //     this.setState((state) => { requestUsers: state.requestUsers.push(availability.val()); }
  //       // state.requestUsers.push(request.val())
  //   );
  //   });
  // }

  acceptInvite = (user) => {
    console.log(user);
    console.log(user.start);
    console.log(user.id);
    const start = user.start;
    // let start;
    //  for (const startDate in match) {
    //    start = startDate;
    //  }
    const that = this;
    const chatInfoForUs = {image: user.image, name: user.name, chatId: `${this.props.reduxStoreProps.user.id}${user.id}`}
    const chatInfoForThem = {image: this.props.reduxStoreProps.user.image, name: this.props.reduxStoreProps.user.name, chatId: `${this.props.reduxStoreProps.user.id}${user.id}`}
    const theirAvailabilityRef = firebase.database().ref(`users/${user.id}/availability/${start}/chat/${this.props.reduxStoreProps.user.id}`);
    const availabilityRef = firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${start}/chat/${user.id}`).set({
      image: user.image, name: user.name, chatId: `${this.props.reduxStoreProps.user.id}${user.id}` }).then(() => {
        theirAvailabilityRef.set(chatInfoForThem).then(() =>
        getAvailabilityArray(this.props.reduxStoreProps.user.id).then(availability => that.setState({ availability })));
        this.removeRequest(user) });
  }

  removeRequest = (user) => {
    console.log('in removeRequest')
    const id = this.props.reduxStoreProps.user.id;
    console.log(user);
    console.log(`users/${id}/requests/${user.id}`);
    firebase.database().ref(`users/${id}/requests/${user.id}`).remove().then(this.getRequests());
  }

  renderRequests() {
    console.log(this.state.requestUsers)
    if (this.state.requestUsers.length <= 0) { return };
    return (
      <View>
        <Text style={{ fontSize: 18, alignSelf: 'center' }}>Chat invitations</Text>
        {this.state.requestUsers.map((user, index) => {
          let profile;
          for (var key in user) {
            profile = user[key]
          }
          if (!profile) {
            return;}
          return (
            <UserRow key={index} user={profile} key={profile.id} accept={this.acceptInvite} decline={this.removeRequest} />
            )}
          )
        }
      </View>);
  }



  renderChatDates = () => {
    var dates = [];
    const availability = this.state.availability;
    console.log(availability);
    for (var key in availability) {
      dates.push({ [key]: availability[key]});
    }
    return (dates.map((date, index) => {
      console.log(date);
      let dateValues;
      for (const key in date) {
        dateValues = date[key];
      }
      let users = [];
      const chats = dateValues.chat
      for (const key in chats) {
        users.push(chats[key]);
      }
      if (!chats) {
        return;
      }
      const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
      const dataSource = ds.cloneWithRows(users)
      return (
        <View key={index} style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
          <View>
            <Text style={{ fontSize: 14 }}>
              {`${unixToShortDate(dateValues.start)} - ${unixToShortDate(dateValues.end)} - ${dateValues.city}`}
            </Text>
          </View>
          <ListView
            horizontal
            dataSource={dataSource}
            renderRow={user =>
              <TouchableHighlight key={index} onPress={() => this.goToChat(user)}>
                <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20, marginHorizontal: 8 }} />
              </TouchableHighlight>}
          />
        </View>
      ) }))
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
    Actions.chat({user});
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
