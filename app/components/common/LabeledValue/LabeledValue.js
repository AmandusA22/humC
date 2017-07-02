import React, { PropTypes } from 'react';
import { View,  Text } from 'react-native';
import styles from './styles';


const defaultProps = {
  label: 'Label',
  value: 'Value',
};

function LabeledValue(props) {
  const style = [
    styles.container,
    ...(props.style ? [props.style] : []),
  ];

  return (
    <View style={style}>
      <Text style={styles.label}>{props.label}</Text>
      <Text onPress={props.labelPressed} style={styles.value}>{props.value}</Text>
    </View>
  );
}

// LabeledValue.propTypes = propTypes;
// LabeledValue.defaultProps = defaultProps;

export default LabeledValue;
