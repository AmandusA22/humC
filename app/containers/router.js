import React, { Component } from 'react';
import { Router, Scene } from 'react-native-router-flux';
//import Feeds from ''
//import CodeScreen from '../components/login/CodeScreenContainer';
//import LoginForm from '../components/login/LoginFormContainer';
//import PasswordScreen from '../components/PasswordScreenContainer';
import CreateProfile from '../components/createProfile/CreateProfileContainer';
import Calendar from '../components/calendar/CalendarViewContainer';
import SearchWingman from '../components/searchWingman/SearchWingman';
import LoginWithFacebook from '../components/login/FacebookLogin';
import MatchList from '../components/matches/MatchList';
import Chat from '../components/matches/Chat';
//<Scene key="LoginWithFacebook" inTab={false} component={LoginWithFacebook}  hideNavBar />

import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from '../images/backIcon.jpg';

const TabIcon = (props) => (
  <Text
    style={{ color: props.selected ? 'red' : 'black' }}
  >
    {props.title}
  </Text>
)


export default class router extends Component {

  render() {
    return (
        <Router>
          <Scene key="root">
            <Scene key="LoginWithFacebook" component={LoginWithFacebook} hideNavBar />
            <Scene key="createProfile" inTab={false} component={CreateProfile} hideNavBar />
              <Scene key="calendar" inTab={false} component={Calendar} hideNavBar />

 <Scene key="tabBar" tabs hideNavBar inTab={true} tabBarStyle={style.tabBarStyle}>
            <Scene key="calendarTab" inital="calendarTab" initial title="Calendar" icon={TabIcon}>
                <Scene key="CalendarTab" title="Calendar" component={Calendar} icon={TabIcon} hideNavBar />
                <Scene key="searchWingman" component={SearchWingman} icon={TabIcon} hideNavBar />
              </Scene>
              <Scene key="settings" title='Settings' icon={TabIcon} component={CreateProfile} hideNavBar />
              <Scene key="matchTab" inital="MatchList" initial title="Matches" icon={TabIcon} >
                <Scene key="MatchList" title="Matches" component={MatchList} icon={TabIcon}  hideNavBar />
                <Scene key="chat" component={Chat} icon={TabIcon} hideNavBar />
              </Scene>
            </Scene>
          </Scene>

        </Router>
    );
  }
}
//
//           </Scene>

let style = StyleSheet.create({
  tabBarStyle: {
    borderTopWidth: 0.5,
    borderColor: '#b7b7b7',
    backgroundColor: 'white',
    height: 50,
  },
});

//             <Scene key="createProfile" inTab={false} component={CreateProfile}  />

// <Scene key="calendar" inTab={false} component={Calendar} />
// <Scene key="tabBar" tabs hideNavBar inTab={true} tabBarStyle={ style.tabBarStyle } >
// <Scene key="calendarTab" inital="calendarTab" title="Calendar" icon={TabIcon}>
//     <Scene key="CalendarTab" title="Calendar" component={Calendar} icon={TabIcon} hideNavBar />
//     <Scene key="searchWingman" component={SearchWingman} icon={TabIcon} hideNavBar />
//   </Scene>
//   <Scene key="settings" title='Settings' icon={TabIcon} component={CreateProfile} hideNavBar />
// </Scene>
