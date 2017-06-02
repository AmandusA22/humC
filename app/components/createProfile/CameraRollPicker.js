import React, { Component } from 'react';
import {

  View,
  ImagePickerIOS,
  Image,
} from 'react-native';

export default class CameraRollPicker extends Component {
  constructor() {
    super();
    this.state = { image: null };
  }

  componentDidMount() {
    this.pickImage();
  }

  pickImage() {
    // openSelectDialog(config, successCallback, errorCallback);
    ImagePickerIOS.openSelectDialog({}, (imageUri) => {
      // this.setState({ image: imageUri });
      console.log('in pickImage');
      this.props.updateImage(imageUri)
      console.log('')
    }, error => console.error(error));
  }

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.image ?
          <Image style={{ flex: 1 }} source={{ uri: this.state.image }} /> :
          null
        }
      </View>
    );
  }
}
