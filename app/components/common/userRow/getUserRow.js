
import React, { Component } from 'react';
import { View, Image, Text, Linking, Platform, Dimensions } from 'react-native';
import Button from 'react-native-button';
import styles from './styles';

const invite = [{text: 'Invite', color: 'green'}, {text: 'Uninvite', color: 'red'}, {text: 'In chat', color: 'rgba(31,188,210, 0.5)'}]

function isURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
  '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
  '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
  '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
  '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
  '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return pattern.test(str);
}

export default class UserRow extends Component {

  constructor() {
    super()
    this.state = {
      invite: invite[0],
    }
  }

  setInvite = (user) => {
    if (this.state.invite === invite[0]) {
      this.setState({ invite: invite[1] });
      this.props.sendInvite(this.props.user)
    } else {
      this.setState({ invite: invite[0] });
      this.props.uninvite(this.props.user.id)
    }
  }

  componentDidMount() {
    if (this.props.user.invited) {
      this.setState({ invite: invite[1] });
    }
    if (this.props.user.chatting) {
      this.setState({ invite: invite[2] });
    }
  }

  render() {
    console.log('in userropw')
    const props = this.props;
    return (
      <View style={[styles.container, ...(props.style ? [props.style] : [])]}>
      <View style={{ flexDirection: 'row' }}>
      <View style={{ flexDirection: 'column' }}>
        { <Image style={{ height: 100, width: 100 }} source={{ uri: props.user.image }} /> }
        </View>
        <View style={{flexDirection: 'column', marginLeft: 10, width: Dimensions.get('window').width - 120}}>
          <View style={styles.body}>
          <View style={styles.footerItem}>
            <Text style={[styles.footerItemText, styles.footerItemValue]}>Name</Text>
              <Text style={styles.loanAmountLabel}>{props.user.name}
              </Text>
            </View>
            {props.accept ? <Button onPress={() => props.accept(props.user)} style={{marginRight: 20, color: 'green', textAlign: 'center'}}>
              Accept
            </Button> : null}
          {props.decline ?
            <Button onPress={() => props.decline(props.user)} style={{marginRight: 20, color: 'red', textAlign: 'center'}}>
              Decline
            </Button>
              : <Button onPress={this.setInvite} disabled={props.user.chatting} style={{ marginRight: 20, color: this.state.invite.color, textAlign: 'center' }}>
            {this.state.invite.text}
          </Button>}
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
}
