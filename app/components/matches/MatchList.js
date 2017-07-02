import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import { View, ScrollView, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import Button from 'react-native-button';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo';
import { saveAppStateAction } from '../../redux/modules/saveAppState';
import Header from '../common/Header';
import { unixToShortDate, mapStateToProps } from '../common/functions';
import UserRow from '../common/userRow';

class MatchList extends Component {
  constructor() {
    super();
    this.state = { requestUsers: [] };
  }

  componentDidMount() {
    this.getRequests();
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
        // for (const key in request.val()) {
        //   console.log(request.val())
        //   requests.push(request.val()[key]);
        // }
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
    const start = user.start;
    // let start;
    //  for (const startDate in match) {
    //    start = startDate;
    //  }
    const availabilityRef = firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${start}/chat/${user.id}`).set({
      image: user.image, name: user.name, chatId: `${this.props.reduxStoreProps.user.id}${user.id}`}).then(() => this.removeRequest(user))


    // console.log(match);
    // console.log(user);
    // let startDate;
    // let endDate;
    // let city
    // for (var start in match) {
    //   startDate = start;
    //   const endDic = match[start];
    //   for (var end in endDic) {
    //     endDate = end;
    //     city = endDic[end];
    //   }
    // }
    // const that = this;
    //
    // const availabilityRef = firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${startDate}/${endDate}/${city}/${user.id}`);
    // availabilityRef.set({ ;
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
    if (this.state.requestUsers.length <= 0) { return}
    return(
      <View>
        <Text style={{ fontSize: 18, alignSelf: 'center' }}>Chat invitations</Text>
        {this.state.requestUsers.map((user) => {
          let profile;
          for (var key in user) {
            profile = user[key]
          }
          if (!profile) {
            return;
          }
          console.log('profile is');
          console.log(profile);
          return (
            <UserRow user={profile} key={profile.id} accept={this.acceptInvite} decline={this.removeRequest} />
    )})}
  </View>)

  }

  renderChatDates = () => {
    var dates = [];
    const availability = this.props.reduxStoreProps.user.availability;
    for (var key in availability) {
      dates.push({[key]: availability[key]});
    }
    return (dates.map((date) => {
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
      // console.log(chatDateValues);
      // let users = [];
      // for (const key in chatDateValues) {
      //   users.push(chatDateValues[key]);
      // }

      //  const contentDic = date[start];
        // let end;
        // let city;
        // let matchArr = [];
        // for (const key in endDic) {
        //   end = key;
        //   const cityDic = endDic[key];
        //   if (typeof cityDic !== 'string') {
        //   for (const cityKey in cityDic) {
        //     city = cityKey;
        //     matchArr.push(cityDic[cityKey]);
        //   }
        //   } else {
        //     city = cityDic
        //   }
        //   city = endDic[key];
        // }
        return (
          <View style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 14 }}>
                {`${unixToShortDate(dateValues.start)} - ${unixToShortDate(dateValues.end)} - ${dateValues.city}`}
              </Text>
            </View>
            <ScrollView contentInset={{bottom: 64}}>
              {users ? users.map((user) => {
                console.log(user);
                // let user;
                // for (const id in match) {
                //   user = match[id];
                // }
              return(
                <TouchableHighlight key={user.id} onPress={() => this.goToChat(user)}>
                  <Image source={{ uri: user.image }} style={{ height: 100, width: 100, borderRadius: 50, marginTop: 20 }} />
                </TouchableHighlight>
              )
            }) : null}
            </ScrollView>
          </View>
        )

    }));
  }

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
