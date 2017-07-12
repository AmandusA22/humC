
import React, { Component } from 'react';
import {
  View,
  Text,
  TextInput,
  Picker,
  StyleSheet,
  CameraRoll,
  Image,
  Alert,
  TouchableHighlight,
  ScrollView,
  Dimensions,
  KeyboardAvoidingView
} from 'react-native';
import Button from 'react-native-button';
import CameraRollPicker from './CameraRollPicker';
import Camera from 'react-native-camera';
import TakePicture from './TakePicture';
import RequestService from '../../services/RequestService';
import { Actions } from 'react-native-router-flux'
import { connect } from 'react-redux';
import { saveUserInfoAction } from '../../redux/modules/saveUserInfo'
import * as firebase from 'firebase';
import { mapStateToProps } from '../common/functions';
import Header from '../common/Header';
import FBSDK, { LoginButton, LoginManager, AccessToken } from 'react-native-fbsdk';
import LabeledValue from '../common/LabeledValue';
import LabeledInput from '../common/LabeledValue/LabeledInput';


const styles = StyleSheet.create({
  underline: {
    flexDirection: 'row',
    borderColor: 'gray',
    marginTop: 30,
    borderWidth: 1,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 0,
    marginLeft: 40,
    marginRight: 40,
    alignItems: 'center',
  },
  numberInputText: {
    lineHeight: 30,
    borderColor: 'gray',
    color: 'black',
    marginLeft: 40,
    marginRight: 10,
    height: 30,
  //  width: '70%',
    textAlign: 'center',
  },
  descriptionBox: {
    borderWidth: 1,
    borderColor: 'black',
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 40,
    marginRight: 20,
  },
  descriptionInputText: {
    color: 'black',
    textAlign: 'left',
    alignSelf: 'flex-end',
    lineHeight: 20,
    height: 150,
  },
  standardText: {
    lineHeight: 20,
    color: 'black',
    fontSize: 16,
  },
  standardButton: {

    color: 'rgb(33,150,243)',
    lineHeight: 20,
    marginLeft: 10,
    marginRight: 10,
    flexDirection: 'row',
  },
  headerText: {
    fontSize: 22,
    lineHeight: 70,
    textAlign: 'center',
  },
  rowMargin: {
    marginLeft: 15,
    flexDirection: 'row',
  },
  doneButtonContainer: {
    width: 105,
    height: 45,
    backgroundColor: '#00cc7a',
    borderRadius: 8,
  },
  doneButtonText: {
    color: 'white',
    fontSize: 16,
    lineHeight: 45,
  },

  doneButton: {
    alignSelf: 'center',
    marginTop: 40,
  },
  uploadImageContainer: {
    width: 100,
    height: 100,
    borderWidth: 1,
    borderColor: 'black',
    alignSelf: 'flex-end',
  },

  container: {
    flex: 1,
    flexDirection: 'row',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40,
  },
});

class CreateProfile extends Component {

  constructor(props) {
    super(props);
    this.state = {
      interest: 'Women',
      age: 30,
      gender: 'Man',
      picker: null,
      showImagePicker: false,
      showTakePicture: false,
    };
  }

  componentDidMount() {
  //  super.componentDidMount()
    this.setStateFromRedux();
  }

  setStateFromRedux = () => {
    const userProps = this.props.reduxStoreProps.user
    for (const key in userProps) {
      if (key === 'profile_picture') {
        this.updateImage(userProps.profile_picture)
      } else {
        this.setState({ [key]: userProps[key] })
      }
    }
  }

  pickers = () => {
    const pickers = {
      age: this.agePicker(),
      interest: this.interestedInPicker(),
      gender: this.genderPicker(),
      none: null,
    };
    return pickers[this.state.picker];
  }

  agePicker = () =>
    <View>
      {this.doneButton()}
      <Picker
        selectedValue={this.state.age}
        onValueChange={age => this.setState({ age })}
      >
        {Array(100).fill(' ').map((value, index) =>
          <Picker.Item label={`${index}`} key={index} value={`${index}`} />,
        )}
      </Picker>
    </View>

  genderPicker = () =>
    <View>
      {this.doneButton()}
      <Picker
        selectedValue={this.state.gender}
        onValueChange={gender => this.setState({ gender })}
      >
        <Picker.Item label="Man" value="Man" />
        <Picker.Item label="Women" value="Women" />
        <Picker.Item label="Other" value="Other" />
      </Picker>
    </View>

  doneButton = () =>

    <Button style={styles.doneButton} onPress={this.setNoPicker}>
      Done
    </Button>

    setNoPicker = () => {

      //this.scrollView.scrollTo({x: 0, y: 300, animated: true})
      this.setState({ picker: null });
  }

  interestedInPicker = () =>
    <View>
      {this.doneButton()}
      <Picker
        selectedValue={this.state.interest}
        onValueChange={interest => this.setState({ interest })}
      >
        <Picker.Item label="Women" value="Women" />
        <Picker.Item label="Men" value="Men" />
        <Picker.Item label="Men and Women" value="Men and Women" />
      </Picker>
    </View>

  GetUIComponents = () => [this.getProfileNameRow(), this.getAgeRow(), this.getInterestsRow(), this.getDescriptionRow(), this.getUploadPictureRow()]

  getProfileNameRow = () =>
    <LabeledInput
      setValue={name => this.setState({ name })}
      label="Full name"
      value={this.state.name}
      style={{ flex: 1, height: 50 }}
      keyboardType="default"
      returnKeyType="done"
    />

  getInterestsRow = () => <LabeledValue labelPressed={() => this.setState({ picker: 'interest' })} label="interest" value={this.state.interest} style={{ flex: 1, height: 50 }} />

  getAgeRow = () =>
    <View style={{ flexDirection: 'row' }}>
      <LabeledValue labelPressed={() => this.setState({ picker: 'age' })} label="age" value={`${this.state.age} years old`} style={{ flex: 1, height: 50 }} />
      <LabeledValue labelPressed={() => this.setState({ picker: 'gender' })} label="gender" value={this.state.gender} style={{ flex: 1, height: 50 }} />
    </View>

  getDescriptionRow = () =>
    <LabeledInput
      setValue={description => this.setState({ description })}
      label="Describe yourself"
      value={this.state.description}
      style={{ flex: 1, height: 50 }}
      keyboardType="default"
      returnKeyType="done"
    />

  getUploadPictureRow = () =>
    <View style={{ marginTop: 40 }}>
      {this.state.image ?
        <View style={{ alignItems: 'center' }}>
          <Image style={{ height: 100, width: 100 }} source={{ uri: this.state.image }} />
          <Button onPress={() => this.showImageAlert()}>
            Change Image
          </Button>
        </View> :
        <Button onPress={() => this.showImageAlert()}>Choose Image</Button>
        }

    </View>

  updateImage = (image) => {
    console.log('update image')
    this.setState({ image, showImagePicker: false, showTakePicture: false });
    // console.log(image);
  }

  ifDisplayImageTakers = () => {
    if (this.state.showImagePicker) {
      return <CameraRollPicker updateImage={this.updateImage} />;
    } else if (this.state.showTakePicture) {
      return <TakePicture updateImage={this.updateImage} />;
    }
    return this.createInputs();
  }

  sendCreateProfile = () => {
    const saveData = {
      age: this.state.age,
      interest: this.state.interest,
      gender: this.state.gender,
      image: this.state.image,
      name: this.state.name,
      description: this.state.description,
    };
    firebase.database().ref(`users/${this.props.reduxStoreProps.user.id}`).update(saveData)
    this.props.dispatch(saveUserInfoAction(saveData))
    console.log('sending');
    if (!this.props.reduxStoreProps.app_state) {
      console.log('no app state')
      return Actions.calendar()
    }
    if (this.props.reduxStoreProps.app_state.tabBar) {
      console.log('in tabbar');
      return Actions.CalendarTab();
    }
    console.log('all passed')
    Actions.calendar()

  }

  logout() {
    Actions.LoginWithFacebook();

  }

  ifScroll = () => {
    if(this.state.picker){ return this.scrollView.scrollToEnd({animated: true})}
  }


  createInputs = () =>
  <View style={{flex: 1}}>
    <ScrollView style={{flex: 1, marginLeft: 20, marginRight: 20}}  onContentSizeChange={(contentWidth, contentHeight)=>{
        this.ifScroll()}} contentInset={{bottom: 64}} ref={ref => this.scrollView = ref}>
      <Header variant="transparent" title="CreateAccount" left={<Button onPress={this.logOut}>X</Button>} />
        <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center'}}>
          <LoginButton onLogoutFinished={this.logout} />
        </View>
      {this.GetUIComponents().map((value, index) =>
        <View key={index} style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginTop: 30 }}>

          {value}
        </View>
    )}
      {this.pickers()}
      <View style={{ flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 40 }}>
        <View style={{height: 40 }} />
        <Button
          containerStyle={styles.doneButtonContainer}
          style={styles.doneButtonText}
          onPress={() => this.sendCreateProfile()}
        >
          Done
        </Button>
      </View>

        {this.state.keyboard ? <Button>Done</Button> : null}
    </ScrollView>
</View>

  showImageAlert = () =>
      Alert.alert('Choose Image',
    'Do you wanna select image from gallery or take picture',
      [{text: 'Gallery', onPress: () => this.setState({ showImagePicker: true })},
      {text: 'Take new', onPress: () => this.setState({ showTakePicture: true }) }
      ]
    )

    render() {
      if (this.state.picker !== null) {
        this.scrollView.scrollToEnd({animated: true});
      } else {
      }
      console.log('in render');
      console.log(this.props)
      return (
        this.ifDisplayImageTakers()
      );
    }
  }

export default connect(mapStateToProps)(CreateProfile);
