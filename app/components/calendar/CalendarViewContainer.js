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
import { mapStateToProps, getAvailabilityArray } from '../common/functions';
import AvailabilityRow from '../common/AvailabilityRow';
export class Calendar extends Component {

  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
      city: 'Stockholm',
    };
  }

  componentDidMount() {
    getAvailabilityArray(`${this.props.reduxStoreProps.user.id}`).then(availabilities => this.setState({ availabilities }));
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
    let start = this.state.selectedStartDate.getTime();
    let end = this.state.selectedEndDate.getTime();
    const startDate = new Date(+start).getTime();
    const endDate = new Date(+end).getTime();
    firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}/availability/${startDate}`).set({
      start: startDate,
      end: endDate,
      city: this.state.city,
      chats: [],
    });
    while (new Date(start).getTime() < new Date(end).getTime()) {
       firebase.database().ref(`${this.state.city}/${startDate}/${this.props.reduxStoreProps.user.id}`).set({
          occupied: 'yes',
       });
       start += 1000 * 60 * 60 * 24
      //  const newDate = new Date(start.getDate() + 1);
      //  //const day = 1000 * 60 * 60 * 24;
      //  start = new Date(newDate).getDate()
     }

     if (!this.props.reduxStoreProps.app_state.tabBar) {
       console.log('!inTab');
       this.props.dispatch(saveAppStateAction({ tabBar: true }))
       Actions.tabBar()
     } else {
       const transferStartDate = new Date(this.state.selectedStartDate);
       const transferEndDate = new Date(this.state.selectedEndDate);
       Actions.searchWingman({ start: startDate, end: transferEndDate, city: this.state.city }); }
   }

   getAvailabilityRows = () => {
     console.log(this.state.availabilities)
    if (this.state.availabilities) {
      console.log('inside')
      return(
        <View style={{flex: 1}}>
          <Text style={{marginTop: 50, fonSize: 14, fontWeight: 'bold', alignSelf: 'center'}}>Available dates</Text>
            {this.state.availabilities.map((availability) => {
              console.log('mapping')
              if (availability.start) {
                return (<AvailabilityRow availability={availability} />)
              }
            })}
        </View>
      );
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
     const endArr = endDate.split(' ')
    displayableEndDate = endArr[0] + ' ' + endArr[1] + ' ' + endArr[2]
    } else if (displayableStartDate) {
    displayableEndDate = displayableStartDate
  }

    return (
      <ScrollView contentInset={{bottom: 44}} style={styles.container} contentContainerStyle={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.text}>I will be in </Text>
          <Button style={styles.text}> Stockholm </Button>
        </View>
        <View style={{marginLeft: 30, marginRight: 30, alignItems: 'center', marginBottom: 30}}>
          {displayableStartDate ?
             <Text style={styles.text}> Between { displayableStartDate } and { displayableEndDate } </Text>
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
              {this.getAvailabilityRows()}

          </View>
      </ScrollView>
    );
  }
}

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
    marginRight: 30
  },
  text: {
    lineHeight: 30
  },
});

export default connect(mapStateToProps)(Calendar);
