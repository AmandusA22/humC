import React from 'react';
import { View, Image, Text, Linking, Platform, Dimensions } from 'react-native';
import Button from 'react-native-button';
import styles from './styles';
import {unixToShortDate} from '../functions'



function AvailabilityRow(props) {
  console.log('in availabilityRow')
  console.log(props.availability)
  return (
    <View style={[styles.container, ...(props.style ? [props.style] : [])]}>
    <View style={{flexDirection: 'row'}}>
        <View style={styles.body}>
        <View style={styles.footerItem}>
            <Text style={styles.loanAmountLabel}>{`${unixToShortDate(props.availability.start)} --> ${unixToShortDate(props.availability.end)}`}
            </Text>
          </View>
          <Button onPress={() => props.findWingman(props.availability)} style={{marginRight: 20, fontSize: 16, color: 'green', textAlign: 'center'}}>
          Find wingman
          </Button>
        </View>
      </View>
      <View style={{flexDirection: 'row'}}>
        <View style={[styles.footer, {width: Dimensions.get('window').width - 30, marginLeft: 15, marginRight: 15}]}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>{props.availability.chats ? props.availability.chats.length : 0}</Text>
            <Text style={styles.footerItemText}>Chats</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>{props.availability.city}</Text>
            <Text style={styles.footerItemText}>City</Text>
          </View>
          <View style={styles.footerItem}>

          <Button onPress={() => props.removeAvailability(props.availability)} style={{marginRight: 20, fontSize: 16, color: 'red', textAlign: 'center'}}>
            Cancel availability
          </Button>
          </View>

          </View>

          </View>
    </View>
  );
}


export default AvailabilityRow;
