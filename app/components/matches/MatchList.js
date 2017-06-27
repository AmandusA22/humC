import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import { View, ScrollView, StyleSheet, Text, Image, TouchableHighlight } from 'react-native';
import React, { Component } from 'react';
import { Actions } from 'react-native-router-flux';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo';
import { saveAppStateAction } from '../../redux/modules/saveAppState';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import Button from 'react-native-button';
import Header from '../common/Header';
import { unixToShortDate } from '../common/functions';
import { mapStateToProps } from '../common/functions';

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
    const match = user.match;
    console.log(match);
    console.log(user);
    let startDate;
    let endDate;
    let city
    for (var start in match) {
      startDate = start;
      const endDic = match[start];
      for (var end in endDic) {
        endDate = end;
        city = endDic[end];
      }
    }
    const that = this;
    const availabilityRef = firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${startDate}/${endDate}/${city}/${user.id}`);
    availabilityRef.set({ image: user.image, name: user.name, chatId: `${this.props.reduxStoreProps.user.id}${user.id}`}).then(() => that.removeRequest(user));
  }

  removeRequest(user) {
    console.log('in removeRequest')
    const id = this.props.reduxStoreProps.user.id;
    console.log(user);
    console.log(`users/${id}/requests/${user.id}`);
    firebase.database().ref(`users/${id}/requests/${user.id}`).remove().then(this.getRequests());
  }

  renderRequests() {
    console.log(this.state.requestUsers)
    return(
      <View>
        <Text style={{ fontSize: 18}}>Chat invitations</Text>
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
            <View style={{ flexDirection: 'row', height: 110 }}>
              <Image style={{ height: 100, width: 100 }} source={{ uri: profile.image }} />
              <View>
              <Text>{profile.name} is a {profile.age} year old {profile.gender} with an interest in
                      {profile.interest} he would describe himself as {profile.description}
              </Text>
                 <Button onPress={() => this.acceptInvite(profile)}>
                   Accept
                 </Button>
                 <Button onPress={() => this.removeRequest(profile)}>Decline</Button>
              </View>
            </View>);
      })}
      </View>
    )
  }

  renderChatDates = () => {
    var dates = [];
    const availability = this.props.reduxStoreProps.user.availability;
    for (var key in availability) {
      dates.push({[key]: availability[key]});
    }
    return (dates.map((date) => {
      for (const start in date) {
        const endDic = date[start];
        let end;
        let city;
        let matchArr = [];
        for (const key in endDic) {
          end = key;
          const cityDic = endDic[key];
          if (typeof cityDic !== 'string') {
          for (const cityKey in cityDic) {
            city = cityKey;
            matchArr.push(cityDic[cityKey]);
          }
          } else {
            city = cityDic
          }
          city = endDic[key];
        }
        return (
          <View style={{ flex: 1, marginTop: 30, justifyContent: 'center', alignItems: 'center' }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{`${unixToShortDate(start)} - ${unixToShortDate(end)} - ${city}`}</Text>
            </View>
            <ScrollView>
              {matchArr.map((match) => {
                let user;
                for (const id in match) {
                  user = match[id];
                }
              return(
                <TouchableHighlight onPress={() => this.goToChat(user)}>
                  <Image source={{ uri: user.image }} style={{ height: 100, width: 100 }} />
                </TouchableHighlight>
              )
            })}
            </ScrollView>
          </View>
        )
      }
    }));
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
