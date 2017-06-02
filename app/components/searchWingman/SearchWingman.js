import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View
} from 'react-native';

export default class SearchWingman extends Component {

  constructor(props) {
    super(props);
    this.people = [{ description: 'hi', age: 27, gender: 'Male', interest: 'women' }];
  }

  render(){
    console.log('in searchWingman');
    return(
      <View>

      </View>)
  }
}
