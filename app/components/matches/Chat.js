import React from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableHighlight,
  Image,
  Button,
  Alert,
} from 'react-native';
import * as firebase from 'firebase';
import Header from '../common/Header';
import {GiftedChat, Actions, Bubble} from 'react-native-gifted-chat';
import CustomActions from './CustomActions';
import CustomView from './CustomView';
import { connect } from 'react-redux';
import { mapStateToProps } from '../common/functions';
import BackIcon from '../../images/back-icon.png';
import { Actions as Action } from 'react-native-router-flux';


class Chat extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      loadEarlier: false,
      typingText: false,
      isLoadingEarlier: false,
    };

    this.onSend = this.onSend.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this._isAlright = null;
  }

  componentWillMount() {
    this.getMessages();
  //  firebase.database().ref(`users/${ourId}/chats/${theirId}/unseen`).set(0);
  }

  componentWillUnmount() {
    const ourId = this.props.reduxStoreProps.user.id;
    const theirId = this.props.user.id;
    console.log('unmounting')
    firebase.database().ref(`users/${ourId}/chats/${theirId}/unseen`).set(0).then(() => {
    });
  }

  getMessages() {
    firebase.database().ref(`chats/${this.props.user.chatId}`).on('value', ((chat) => {
      if (!chat.val()) {
        return;
      }
      const dbMessages = chat.val();
      const messageArray = Object.values(dbMessages);
      const messages = messageArray.map(hiddenMessage => hiddenMessage[0]);
      messages.reverse();
      return this.setState({ messages });
    }));
  }


  onSend(messages = []) {
    const ourId = this.props.reduxStoreProps.user.id;
    const theirId = this.props.user.id;
    const unseenRef = firebase.database().ref(`users/${theirId}/chats/${ourId}/unseen`);
    unseenRef.transaction((unseen) => {
      return unseen + 1;
    }).then(() =>
      firebase.database().ref(`chats/${this.props.user.chatId}`).push(messages),
    );
  }

  renderBubble(props) {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          left: {
            backgroundColor: '#f0f0f0',
          }
        }}
      />
    );
  }

  // renderCustomView(props) {
  //   return (
  //     <CustomView
  //       {...props}
  //     />
  //   );
  // }

  renderFooter(props) {
    if (this.state.typingText) {
      return (
        <View style={styles.footerContainer}>
          <Text style={styles.footerText}>
            {this.state.typingText}
          </Text>
        </View>
      );
    }
    return null;
  }

  toMatch() {
    Action.pop();
  }

  removeAlert() {
    Alert.alert('Remove',
      `are you sure you want to remove ${this.props.user.name} from your chat?`,
      [{ text: 'Yes', onPress: () => this.removeUserFromChat() },
      { text: 'No' },
      ],
    );
  }

  removeUserFromChat = () => {
    const ourID = this.props.reduxStoreProps.user.id;
    const theirId = this.props.user.id;
    const removeThemFromUs = firebase.database().ref(`users/${ourID}/chats/${theirId}`).remove();
    const removeUsForThem = firebase.database().ref(`users/${theirId}/chats/${ourID}`).remove().then(() => Action.MatchList());
  }

  addAsFavorite = () => {
    const ourID = this.props.reduxStoreProps.user.id;
    const theirId = this.props.user.id;
    const newPostKey = firebase.database().ref(`users/${ourID}/chats/${theirId}`).push().key;
    const updates = {};
    updates[`users/${ourID}/chats/${theirId}/favorite`] = true;
    return firebase.database().ref().update(updates);
  //  firebase.database().ref(`users/${ourID}/chats/${theirId}`).update();
  }

  leftHeader = () => <TouchableHighlight onPress={() => this.toMatch()}>
    <Image source={BackIcon} />
  </TouchableHighlight>


  render() {
    return (
      <View style={styles.container}>
        <Header
          variant="transparent"
          left={this.leftHeader()}
          title={this.props.user.name}
          right={<Button title="X" onPress={() => this.removeAlert()} />}
        />
        <TouchableHighlight onPress={this.addAsFavorite}>
          <Text>Add as favorite</Text>
        </TouchableHighlight>
        <GiftedChat
          messages={this.state.messages}
          onSend={this.onSend}
          loadEarlier={this.state.loadEarlier}
          isLoadingEarlier={this.state.isLoadingEarlier}
          user={{ _id: this.props.reduxStoreProps.user.id }}
          renderBubble={this.renderBubble}
          renderCustomView={this.renderCustomView}
          renderFooter={this.renderFooter}
          bottomOffset={56}
        />
      </View>
    );
  }
}

export default connect(mapStateToProps)(Chat);

const styles = StyleSheet.create({
  footerContainer: {
    marginTop: 5,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 10,
  },
  footerText: {
    fontSize: 14,
    color: '#aaa',
  },
  container: {
    marginBottom: 56,
    flex: 1,
  },
});
