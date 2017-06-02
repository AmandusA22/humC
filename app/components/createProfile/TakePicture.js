import {
  View,
  Text,
  StyleSheet,
} from 'react-native';
import React, { Component } from 'react';
import Camera from 'react-native-camera';


const styles = StyleSheet.create({
  doneButton: {
    alignSelf: 'flex-end',
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

export default class TakePicture extends Component {
  render() {
    console.log('rendering takePicture');
    return (
      <View style={styles.container}>
        <Camera
          ref={(cam) => {
            this.camera = cam;
          }}
          style={styles.preview}
        >
          <Text style={styles.capture} onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
        </Camera>
      </View>
    );
  }

  takePicture() {
    const options = {};
    //options.location = ...
    this.camera.capture({metadata: options})
      .then((data) => { this.props.updateImage(data.mediaUri)})
      .catch(err => console.error(err));
  }
}
