import { StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    paddingBottom: 4,
  },
  label: {
    fontSize: 16,
  },
  value: {
    fontSize: 16,
    fontWeight: '300',
    marginBottom: 3,
    marginTop: 3,
    height: 16,
    flex: 0.5,
  },
  valueBox: {
    borderBottomWidth: 1,
    flexDirection: 'row',
    flex: 0.4,
  },
});

export default styles;
