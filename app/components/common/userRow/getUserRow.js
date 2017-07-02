import React from 'react';
import { View, Image, Text, Linking, Platform, Dimensions } from 'react-native';
import Button from 'react-native-button';
import styles from './styles';


function UserRow(props) {
  return (
    <View style={[styles.container, ...(props.style ? [props.style] : [])]}>
    <View style={{flexDirection: 'row'}}>
    <View style={{flexDirection: 'column'}}>
      <Image style={{height: 100, width: 100}} source={{ uri: props.user.image }} />
      </View>
      <View style={{flexDirection: 'column', marginLeft: 10, width: Dimensions.get('window').width - 120}}>
        <View style={styles.body}>
        <View style={styles.footerItem}>
          <Text style={[styles.footerItemText, styles.footerItemValue]}>Name</Text>
            <Text style={styles.loanAmountLabel}>{props.user.name}
            </Text>
          </View>
          <Button onPress={props.setValue} style={{marginRight: 20, color: 'green', textAlign: 'center'}}>
          Invite
          </Button>
        </View>
        <View style={styles.footer}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>{props.user.age}</Text>
            <Text style={styles.footerItemText}>Age</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>{props.user.interest}</Text>
            <Text style={styles.footerItemText}>Interest</Text>
          </View>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>{props.user.description}</Text>
            <Text style={styles.footerItemText}>Description</Text>
          </View>
          </View>

          </View>
        </View>
    </View>
  );
}


export default UserRow;
