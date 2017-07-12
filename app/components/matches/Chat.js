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

    this._isMounted = false;
    this.onSend = this.onSend.bind(this);
    this.onReceive = this.onReceive.bind(this);
    this.renderCustomActions = this.renderCustomActions.bind(this);
    this.renderBubble = this.renderBubble.bind(this);
    this.renderFooter = this.renderFooter.bind(this);
    this.onLoadEarlier = this.onLoadEarlier.bind(this);

    this._isAlright = null;
  }

  componentWillMount() {
    this._isMounted = true;
    this.setState(() => {
      return {
        messages: [],
      };
    });
  }

  componentWillUnmount() {
    this._isMounted = false;
  }

  onLoadEarlier() {
    this.setState((previousState) => {
      return {
        isLoadingEarlier: true,
      };
    });

    setTimeout(() => {
      if (this._isMounted === true) {
        this.setState((previousState) => {
          return {
            messages: GiftedChat.prepend(previousState.messages, require('./data/old_messages.js')),
            loadEarlier: false,
            isLoadingEarlier: false,
          };
        });
      }
    }, 1000); // simulating network
  }

  onSend(messages = []) {
    console.log(messages);
    console.log(this.state);
    console.log(this.props);
    firebase.database().ref(`chats/${this.props.user.chatId}`).set(messages);

    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, messages),
      };
    });

    // for demo purpose
    this.answerDemo(messages);
  }

  answerDemo(messages) {
    if (messages.length > 0) {
      if ((messages[0].image || messages[0].location) || !this._isAlright) {
        this.setState((previousState) => {
          return {
            typingText: ''
          };
        });
      }
    }

    setTimeout(() => {
      if (this._isMounted === true) {
        if (messages.length > 0) {
          if (messages[0].image) {
            this.onReceive('Nice picture!');
          } else if (messages[0].location) {
            this.onReceive('My favorite place');
          } else {
            if (!this._isAlright) {
              this._isAlright = true;
              this.onReceive('reply looks like this');
            }
          }
        }
      }

      this.setState((previousState) => {
        return {
          typingText: null,
        };
      });
    }, 1000);
  }

  onReceive(text) {
    this.setState((previousState) => {
      return {
        messages: GiftedChat.append(previousState.messages, {
          _id: Math.round(Math.random() * 1000000),
          text: text,
          createdAt: new Date(),
          user: {
            _id: 2,
            name: 'Amandus Axelsson',
            // avatar: 'https://facebook.github.io/react/img/logo_og.png',
          },
        }),
      };
    });
  }

  renderCustomActions(props) {
    if (Platform.OS === 'ios') {
      return (
        <CustomActions
          {...props}
        />
      );
    }
    const options = {
      'Action 1': (props) => {
        alert('option 1');
      },
      'Action 2': (props) => {
        alert('option 2');
      },
      'Cancel': () => {},
    };
    return (
      <Actions
        {...props}
        options={options}
      />
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

  renderCustomView(props) {
    return (
      <CustomView
        {...props}
      />
    );
  }

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
    Action.MatchList();
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
    console.log('removing')
    const ourID = this.props.reduxStoreProps.user.id;
    const pathInAvailability = `availability/${this.props.path}`;
    const theirId = this.props.user.id
    firebase.database().ref(`users/${ourID}/${pathInAvailability}/${theirId}`).remove();
  }

  leftHeader = () => <TouchableHighlight onPress={() => this.toMatch()}>
      <Image source={BackIcon}></Image>
    </TouchableHighlight>


  render() {
    return (
      <View style={{ marginBottom: 56, flex: 1 }}>
        <Header variant="transparent" left={this.leftHeader()}
          title={this.props.user.name} right={<Button title="X" onPress={() => this.removeAlert()} />} />
      <GiftedChat
        messages={this.state.messages}
        onSend={this.onSend}
        loadEarlier={this.state.loadEarlier}
        onLoadEarlier={this.onLoadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        user={{
          _id: this.props.reduxStoreProps.user.id, // sent messages should have same user._id
        }}
        renderActions={this.renderCustomActions}
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
});
