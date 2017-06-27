import { StyleSheet, Platform } from 'react-native';
//import variables from '../../variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
  //  justifyContent: 'center',
  //  alignItems: 'center',
    alignSelf: 'stretch',
    paddingHorizontal: 8,
    paddingBottom: 8,
    ...Platform.select({
      ios: {
        paddingTop: 20,
      },
      android: {
        paddingTop: 0,
      },
    }),
  },
  containerLight: {
    backgroundColor: '#fff',
    borderBottomWidth: 1,

  },
  element: {
    fontSize: 24,
    fontWeight: '600',
  //  fontFamily: variables.fonts.primary,
    paddingVertical: 16,
  },
});

export default styles;
