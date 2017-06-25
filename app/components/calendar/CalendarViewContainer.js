import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Button from 'react-native-button';
import { Actions } from 'react-native-router-flux';
import * as firebase from 'firebase';
import { connect } from 'react-redux';
import { saveAppStateAction } from '../../redux/modules/saveAppState';

export class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      city: 'Stockholm',
    };
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
   confirmAvailability = () => {
     console.log(this.props);
     var start = this.state.selectedStartDate
     var end = this.state.selectedEndDate
     const now = new Date(start).getTime()
     firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${now}`).set({
       [new Date(end).getTime()]: this.state.city
     })
     while(start < end){
        firebase.database().ref(`${this.state.city}/${start}/${this.props.reduxStoreProps.user.id}`).set({
          occupied: 'yes',
        })
       var newDate = start.setDate(start.getDate() + 1);
       start = new Date(newDate);
     }

     if (!this.props.reduxStoreProps.app_state.tabBar) {
       console.log('!inTab');
       this.props.dispatch(saveAppStateAction({ tabBar: true }))
       Actions.tabBar() }
     else { Actions.searchWingman({ start: this.state.selectedStartDate, end: this.state.selectedEndDate, city: this.state.city }); }
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
     const endArr = endDate.split(' ')
    displayableEndDate = endArr[0] + ' ' + endArr[1] + ' ' + endArr[2]
    } else if (displayableStartDate) {
    displayableEndDate = displayableStartDate
  }

    return (
      <View style={styles.container}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 30, marginRight: 30}}>
          <Text style={{lineHeight: 30}}>I will be in </Text>
          <Button style={{lineHeight: 30}}> Stockholm </Button>
        </View>
        <View style={{marginLeft: 30, marginRight: 30, alignItems: 'center', marginBottom: 30}}>
          {displayableStartDate ?
             <Text style={{lineHeight: 30}}> Between { displayableStartDate } and { displayableEndDate } </Text>
               :
              <Text>Select dates </Text>
          }
        </View>
          <CalendarPicker
            startFromMonday={true}
            allowRangeSelection={true}
            minDate={minDate}
            todayBackgroundColor="#f2e6ff"
            selectedDayColor="#7300e6"
            selectedDayTextColor="#FFFFFF"
            onDateChange={this.onDateChange}
          />
          <View style={{marginTop: 30}}>
            <Button onPress={this.confirmAvailability}>Confirm Availability and search Wingman</Button>
          </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: '#FFFFFF',
    marginTop: 50,
  },
});

const mapStateToProps = (store) => ({
  reduxStoreProps: store,
});

export default connect(mapStateToProps)(Calendar);
