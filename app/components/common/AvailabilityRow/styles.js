import { StyleSheet } from 'react-native';
//import variables from '../../variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
    margin: 20,
  },
  body: {
    flexDirection: 'row',
  //  paddingHorizontal: 8,
    flex: 1,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
    marginLeft: 15,
    marginRight: 15,
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  loanAmountValue: {
    marginTop: -4,
    fontSize: 24,
    lineHeight: 24,
    paddingRight: 20,
    marginRight: 20,
    // color: variables.colors.text,
    // fontFamily: variables.fonts.primary,
  },
  loanAmountLabel: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: 'bold',
    // color: variables.colors.text,
    // fontFamily: variables.fonts.primary,
    //fontWeight: '300',
  },
  footer: {
    flexDirection: 'row',
  //  paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    justifyContent: 'space-between',

  //  borderColor: variables.colors.secondary,
  },
  // footerItem: {
  //   flex: 1,
  // },
  footerItemText: {
    fontSize: 12,
    // color: variables.colors.textMuted,
    // fontFamily: variables.fonts.primary,
    fontWeight: '300',
  },
  footerItemValue: {
    fontWeight: '600',
  },
});

export default styles;
