import { StyleSheet } from 'react-native';
//import variables from '../../variables';

const white = '#FAFAFA';

const styles = StyleSheet.create({
  button: {
    borderRadius: 2,
    borderTopRightRadius: 16,
    borderBottomLeftRadius: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonPrimary: {
//    backgroundColor: variables.colors.primary,
  },
  buttonSecondary: {
  //  backgroundColor: variables.colors.secondary,
  },
  buttonBlock: {
    alignSelf: 'stretch',
  },
  buttonDisabled: {
    // opacity: 0.2,
  //  backgroundColor: variables.colors.secondary,
  },
  buttonXs: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  buttonSm: {
    paddingVertical: 9.75,
    paddingHorizontal: 16,
  },
  buttonMd: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  buttonLg: {
    paddingVertical: 11,
    paddingHorizontal: 16,
  },
  buttonText: {
    color: white,
  //  fontFamily: variables.fonts.primary,
    fontWeight: '600',
  },
  buttonTextDisabled: {
  //  color: variables.colors.text,
    opacity: 0.5,
  },
  buttonTextXs: {
    fontSize: 21,
  },
  buttonTextSm: {
    fontSize: 16,
    lineHeight: 20,
  },
  buttonTextMd: {
    fontSize: 21,
    lineHeight: 25,
  },
  buttonTextLg: {
    fontSize: 21,
  },
});

export default styles;
