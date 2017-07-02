import React, { PropTypes } from 'react';
import { TouchableOpacity, Text } from 'react-native';
import { upperFirst, isString } from 'lodash';
import styles from './styles';

// const propTypes = {
//   children: PropTypes.node,
//   style: ViewPropTypes.style,
//   disabled: PropTypes.bool,
//   variant: PropTypes.oneOf(['primary', 'secondary']),
//   block: PropTypes.bool,
//   size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
// };

const defaultProps = {
  children: 'Button',
  disabled: false,
  variant: 'primary',
  block: false,
  size: 'md',
};

function Button({ children, style, disabled, variant, size, block, ...rest }) {
  const buttonStyle = [
    styles.button,
    styles[`button${upperFirst(variant)}`],
    styles[`button${upperFirst(size)}`],
    ...(block ? [styles.buttonBlock] : []),
    ...(disabled ? [styles.buttonDisabled] : []),
    ...(style ? [style] : []),
  ];

  const buttonTextStyle = [
    styles.buttonText,
    styles[`buttonText${upperFirst(size)}`],
    ...(disabled ? [styles.buttonTextDisabled] : []),
  ];

  return (
    <TouchableOpacity style={buttonStyle} disabled={disabled} {...rest}>
      {isString(children) ? <Text style={buttonTextStyle}>{children}</Text> : children}
    </TouchableOpacity>
  );
}

// Button.propTypes = propTypes;
Button.defaultProps = defaultProps;

export default Button;
