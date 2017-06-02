import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';
import CalendarPicker from 'react-native-calendar-picker';
import Button from 'react-native-button';
import {Actions} from 'react-native-router-flux'


export default class Calendar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedStartDate: null,
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
     if (!this.props.inTab) {
       console.log('!inTab')
     Actions.tabBar() }
     else {Actions.searchWingman()}
   }

  render() {
    const { selectedStartDate, selectedEndDate } = this.state;
     const minDate = new Date(); // Today
     const maxDate = new Date(2017, 6, 3);
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
      <Text style={{lineHeight: 30}}>I will be in </Text><Button style={{lineHeight: 30}}> Stockholm </Button>
      </View>
      <View style={{marginLeft: 30, marginRight: 30, alignItems: 'center', marginBottom: 30}}>
      {displayableStartDate ? <Text style={{lineHeight: 30}}> Between { displayableStartDate } and { displayableEndDate } </Text> : <Text>Select dates </Text>}
      </View>
        <CalendarPicker
          startFromMonday={true}
          allowRangeSelection={true}
          minDate={minDate}
          maxDate={maxDate}
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
