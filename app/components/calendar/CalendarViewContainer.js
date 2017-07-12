import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { saveAppStateAction } from '../../redux/modules/saveAppState';
import { mapStateToProps, getAvailabilityArray, unixToShortDate } from '../common/functions';
import AvailabilityRow from '../common/AvailabilityRow';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',

  },
  contentContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 30,
    marginRight: 30,
  },
  text: {
    lineHeight: 30,
  },
});

export class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      city: 'Stockholm',
    };
  }

  componentDidMount() {
  //  getAvailabilityArray(`${this.props.reduxStoreProps.user.id}`).then(availabilities => this.setState({ availabilities }));
    this.availabilityListener(this.props.reduxStoreProps.user.id);
  }

  onDateChange = (date, type) => {
    if (type === 'END_DATE') {
      this.setState({
        selectedEndDate: date,
      });
    } else {
      this.setState({
        selectedStartDate: date,
        selectedEndDate: null,
      });
    }
  }

  removeAvailabilityPressed = (availability) => {
    console.log(this.props.reduxStoreProps.user.id);
    console.log(availability.start);
    firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${availability.start}`).remove();
    let start = availability.start;
    while (new Date(start).getTime() < new Date(availability.end).getTime()) {
      firebase.database().ref(`${this.state.city}/${start}/${this.props.reduxStoreProps.user.id}`).remove();
      start += 1000 * 60 * 60 * 24;
    }
  }

  availabilityListener(userId) {
    return firebase.database().ref(`users/${userId}/availability/`).on('value', (() => {
      getAvailabilityArray(`${this.props.reduxStoreProps.user.id}`).then(availabilities => this.setState({ availabilities }));
    }));
  }

  findWingmanPressed = (availability) => {
    Actions.searchWingman(
      { start: availability.start, end: availability.end, city: availability.city });
  }

  getAvailabilityRows = () => {
    if (this.state.availabilities) {
      return (
        <View style={{ flex: 1 }}>
          <Text style={{ marginTop: 50, fontSize: 14, fontWeight: 'bold', alignSelf: 'center' }}>Available dates</Text>
          {this.state.availabilities.map((availability, index) => {
            if (availability.start) {
              return (
                <AvailabilityRow
                  key={index}
                  availability={availability}
                  findWingman={this.findWingmanPressed}
                  removeAvailability={this.removeAvailabilityPressed}
                />);
            }
          })
        }
        </View>
      );
    }
  }

  confirmAvailability = () => {
    let start = this.state.selectedStartDate.getTime();
    const end = this.state.selectedEndDate.getTime();
    const startDate = new Date(+start).getTime();
    const endDate = new Date(+end).getTime();
    firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${startDate}`).set({
      start: startDate,
      end: endDate,
      city: this.state.city,
      chats: [],
    });
    while (new Date(start).getTime() < new Date(end).getTime()) {
      const date = unixToShortDate(start);
      firebase.database().ref(`${this.state.city}/${date}/${this.props.reduxStoreProps.user.id}`).set({
        occupied: 'yes',
      });
      start += 1000 * 60 * 60 * 24;
    }

    if (!this.props.reduxStoreProps.app_state) {
      console.log('!inTab');
      this.props.dispatch(saveAppStateAction({ tabBar: true }))
      Actions.tabBar();
    } else if (this.props.reduxStoreProps.app_state.tabBar) {
      const transferEndDate = new Date(this.state.selectedEndDate);
      Actions.searchWingman({ start: startDate, end: transferEndDate, city: this.state.city });
    } else {
      this.props.dispatch(saveAppStateAction({ tabBar: true }))
      Actions.tabBar();
    }
  }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
    const minDate = new Date();
    let displayableStartDate = ''
    let displayableEndDate = ''
    if(selectedStartDate) {
      const startDate = selectedStartDate.toString()
      const startArr = startDate.split(' ')
      displayableStartDate = startArr[0] + ' ' + startArr[1] + ' ' + startArr[2]
    }
    if (selectedEndDate)  {
      const endDate = selectedEndDate.toString();
      const endArr = endDate.split(' ');
      displayableEndDate = `${endArr[0]} ${endArr[1]} ${endArr[2]}`;
    } else if (displayableStartDate) {
      displayableEndDate = displayableStartDate;
    }
    return (
      <ScrollView
        contentInset={{ bottom: 44 }}
        style={styles.container}
        contentContainerStyle={styles.contentContainer}
      >
        <View style={styles.headerRow}>
          <Text style={styles.text}>I will be in </Text>
          <Button style={styles.text}> Stockholm </Button>
        </View>
        <View style={{ marginLeft: 30, marginRight: 30, alignItems: 'center', marginBottom: 30 }}>
          {displayableStartDate ?
            <Text style={styles.text}>
             Between { displayableStartDate } and { displayableEndDate }
            </Text>
           :
            <Text>Select dates </Text>
          }
        </View>
        <CalendarPicker
          startFromMonday
          allowRangeSelection
          minDate={minDate}
          todayBackgroundColor="#f2e6ff"
          selectedDayColor="#7300e6"
          selectedDayTextColor="#FFFFFF"
          onDateChange={this.onDateChange}
          backgroundColor="#333333"
          occupiedDates={this.state.availabilities ? this.state.availabilities : []}
        />
        <View style={{ marginTop: 30 }}>
          <Button onPress={this.confirmAvailability}>
            Confirm Availability and search Wingman
          </Button>
          {this.getAvailabilityRows()}
        </View>
      </ScrollView>
    );
  }
}


export default connect(mapStateToProps)(Calendar);
