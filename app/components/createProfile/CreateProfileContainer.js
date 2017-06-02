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
  Dimensions,
} from 'react-native';
import Button from 'react-native-button';
import CameraRollPicker from './CameraRollPicker';
import Camera from 'react-native-camera';
import TakePicture from './TakePicture';
import RequestService from '../../services/RequestService';
import {Actions} from 'react-native-router-flux'


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
    //borderBottomWidth: 1,
    borderColor: 'gray',
    color: 'black',
    marginLeft: 40,
    marginRight: 10,
    height: 30,
    width: '70%',
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
    // width: '60%',
    width: '97%',

    //borderColor: 'black',
  },
  standardText: {
    lineHeight: 20,
    color: 'black',
    fontSize: 16,
  },
  standardButton: {
    fontSize: 16,
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
    alignSelf: 'flex-end',
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

export default class CreateProfile extends Component {

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

  pickers = () => {
    const pickers = {
      age: this.agePicker(),
      interest: this.interestedInPicker(),
      gender: this.genderPicker(),
      none: null,
    }
    return pickers[this.state.picker]
  }

  agePicker = () =>
    <View>
      {this.doneButton()}
      <Picker
        selectedValue={this.state.age}
        onValueChange={age => this.setState({ age })}
      >
      {Array(100).fill(' ').map((value, index) =>
        <Picker.Item label={`${index}`} value={`${index}`} />,
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
    <Button style={styles.doneButton} onPress={() => this.setState({ picker: null })}>
      Done
    </Button>


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
    <View style={styles.underline}>
        <TextInput
          placeholder="Full Name"
          value={this.state.name}
          onChangeText={name => this.setState({ name })}
          returnKeyType="done"
          style={styles.numberInputText}
        />
    </View>

  getAgeRow = () =>
  <View style={{flexDirection: 'row'}}>
    <View style={styles.underline}>
      <Text>I'm</Text>
      <Button
        onPress={() => this.setState({ picker: 'age' })}
        style={styles.standardButton}
      >{this.state.age}</Button>
    <Text>Years old </Text>
      </View>
      <View style={[styles.underline, {marginLeft: 0}]}>

        <Text>My gender is</Text>
      <Button
        onPress={() => this.setState({ picker: 'gender' })}
        style={styles.standardButton}
      >
        {this.state.gender}
      </Button>
    </View>
  </View>

  getInterestsRow = () =>
    <View style={styles.underline}>
      <Text style={styles.standardText}>I am interested in </Text>
      <Button
        onPress={() => this.setState({ picker: 'interest' })}
        title={this.state.interest}
        style={styles.standardButton}
      >
        {this.state.interest}
      </Button>
    </View>;

  getDescriptionRow = () =>
    <View style={[styles.underline]}>
      <TextInput
        multiline
        numberOfLines={8}
        onContentSizeChange={(event) => {
          this.setState({height: event.nativeEvent.contentSize.height})}}
        placeholder="Description of yourself and what you're looking for"
        onChangeText={description => this.setState({ description })}
        value={this.state.description}
        style={[styles.numberInputText, this.state.height < 120 ? {height: this.state.height} : {height: 120}]}
      />
    </View>

  getUploadPictureRow = () =>
    <View style={{marginTop: 40}}>
        {this.state.image ?
          <View style={{alignItems: 'center'}}>
            <Image style={{ height: 100, width: 100 }} source={{ uri: this.state.image }} />
              <Button onPress={() => this.showImageAlert()}>
                Change Image
              </Button>
          </View>:
          <Button onPress={() => this.showImageAlert()}>Choose Image</Button>
        }

    </View>

  updateImage = (image) => {
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

    if (!this.props.inTab) {
      Actions.calendar()
    }
  }

  createInputs = () =>
    <View style={{flex: 1, alignItems: 'center'}}>
    <View style={{ height: 20 }} />
    <Text style={styles.headerText}>Create Account</Text>
      {this.GetUIComponents().map((value, index) =>
        <View>
          <View style={{ width: 35 }} />
          {value}
        </View>,
    )}
      {this.pickers()}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 40, }}>
        <View style={{height: 40 }} />
        <Button
          containerStyle={styles.doneButtonContainer}
          style={styles.doneButtonText}
          onPress={this.sendCreateProfile}
        >
          Done
        </Button>
      </View>
    </View>


  showImageAlert = () =>
      Alert.alert('Choose Image',
    'Do you wanna select image from gallery or take picture',
      [{text: 'Gallery', onPress: () => this.setState({ showImagePicker: true })},
      {text: 'Take new', onPress: () => this.setState({ showTakePicture: true }) }
      ]
    )

    render() {
      console.log('in render');
      console.log(this.props)
      return (
        this.ifDisplayImageTakers()
      );
    }
  }
