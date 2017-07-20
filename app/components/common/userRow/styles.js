import { StyleSheet } from 'react-native';
//import variables from '../../variables';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    borderRadius: 4,
  },
  body: {
    flexDirection: 'row',
    flex: 1,
    paddingVertical: 8,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logo: {
    height: 32,
    resizeMode: 'contain',
    marginVertical: 8,
  },
  nameLabel: {
    fontSize: 16,
    lineHeight: 16,
    fontWeight: '300',
  },
  footer: {
    flexDirection: 'row',
    paddingVertical: 8,
    borderBottomWidth: 1,
  },
  footerItem: {
    flex: 1,
  },
  footerItemText: {
    fontSize: 12,
    fontWeight: '300',
  },
  footerItemValue: {
    fontWeight: '600',
  },
  image: {
    height: 100,
    width: 100,
  },
  acceptButton: {
    marginRight: 20,
    color: 'green',
    textAlign: 'center',
  },
  declineButton: {
    marginRight: 20,
    color: 'red',
    textAlign: 'center',
  },
});

export default styles;
