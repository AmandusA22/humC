import React, { PropTypes } from 'react';
import { View, Text } from 'react-native';
import { upperFirst } from 'lodash';
import styles from './styles';

const propTypes = {
  title: PropTypes.string,
  variant: PropTypes.oneOf(['light', 'dark', 'transparent']),
  left: PropTypes.node,
  right: PropTypes.node,
};

const defaultProps = {
  title: 'Title',
  variant: 'light',
  left: null,
  right: null,
};

function Header(props) {
  const style = [
    styles.container,
    styles[`container${upperFirst(props.variant)}`],
  ];

  return (
    <View style={style}>
      {props.left ? <View style={styles.element}>{props.left}</View> : <View />}
      <Text style={styles.element}>{props.title}</Text>
      {props.right ? <View style={styles.element}>{props.right}</View> : <View />}
    </View>
  );
}

Header.propTypes = propTypes;
Header.defaultProps = defaultProps;

export default Header;
