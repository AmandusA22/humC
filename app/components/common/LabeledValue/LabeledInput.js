import { View, ViewPropTypes, Text, TextInput, TouchableHighlight, Platform } from 'react-native';
import React, { Component} from 'react';
import styles from './styles';


const defaultProps = {
  label: 'Label',
  value: '',
  style: styles.container,
  keyboardType: 'numeric',
};


const androidTextInputStyles =  {
      padding: 0,
      alignSelf: 'center',
      marginBottom: -5,
    }


// function LabeledInput(props) {
//   const style = [
//     styles.container,
//     ...(props.style ? [props.style] : []),
//   ];
//
//   function focusTextView() {
//
//   }
//
//   return (
//     <View style={style}>
//       <Text style={styles.label}>{props.label}</Text>
//       <TouchableHighlight onPress={focusTextView()} style={{ flexDirection: 'row' }}>
//         <TextInput
//           style={styles.value}
//           value={props.value}
//           onChangeText={text => props.setValue(props.valueKey, text)}
//           keyboardType={props.keyboardType}
//           ref="Input"
//         />
//       </TouchableHighlight>
//     </View>
//   );
// }

export default class LabeledInput extends Component {

  constructor() {
    super()
    this.state = {
      focusInput: false,
    };
  }

  focusTextView = () => {
    this.setState({ focusInput: true });
  }
  // @autobind
  // setEndValue() {
  //   console.log('in end editing');
  //   if (this.props.value > this.props.max) {
  //     return this.props.setValue(this.props.valueKey, this.props.max)
  //   }
  // }

  setValue = (value) => {
  //  if (this.props.max < value) {
  return this.setValue(value);
    //  return this.props.setValue(this.props.valueKey, this.props.max);

  }

  render() {
    console.log(this.props.value)
    return (
      <View style={[styles.container, this.props.style, { height: 50 }]}>
        <Text style={styles.label}>{this.props.label}</Text>
        <TouchableHighlight onPress={this.focusTextView} style={{ flexDirection: 'row', flex: 1 }}>
          <View style={{ flexDirection: 'row', flex: 1}}>
            <TextInput
              value={`${this.props.value}`}
              onChangeText={this.props.setValue}
              keyboardType={this.props.keyboardType}
              focus={this.state.focusInput}
              style={[styles.value, Platform.OS === 'android' ? androidTextInputStyles : null]}
              returnKeyType='done'
            />
            <Text style={{ width: 90, marginTop: 3, height: 16}}>{this.props.currency}</Text>
          </View>
        </TouchableHighlight>
      </View>
    );
  }
 }
 //  <View style={{ flexDirection: 'row' }}>
//  <Text>{this.props.currency}</Text>
// LabeledInput.defaultProps = defaultProps;
