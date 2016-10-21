import React from 'react';
import {
  Linking,
  ListView,
  Platform,
  Text,
  TouchableHighlight,
  StyleSheet,
  View,
  RefreshControl,
  Image,
  TextInput
} from 'react-native';

import {Icon, Button } from 'native-base';

// Flux
import AltActions from '../../actions/actions';
import AltStore from '../../stores/store';

import { Actions } from 'react-native-router-flux';


var ImagePicker = require('react-native-image-picker');
var ToolbarAndroid = require('ToolbarAndroid');
var toolbarActions = 
    [{title: 'Done', show: 'always'}];

export default class EditProfile extends React.Component {
  constructor(props) {
    super(props);
    
    s = AltStore.getState()
    this.state = {
      name: s.profile.name,
      gender: s.profile.gender,
      pic_source: s.profile.pic_source
    };
    
  }

  selectPhotoTapped() {
    const options = {
      title: 'Photo Picker',
      takePhotoButtonTitle: 'Take Photo...',
      chooseFromLibraryButtonTitle: 'Choose from Library...',
      maxWidth: 200,
      maxHeight: 220,
      aspectX: 2,
      aspectY: 1,
      storageOptions: {
        skipBackup: true
      }
    };

    ImagePicker.showImagePicker(options, (response) => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled photo picker');
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      else {
        var source;

        // You can display the image using either:
        source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        this.setState({
          pic_source: source
        });
      }
    });
  }
  
  componentDidMount() {
    //AltStore.listen((state) => this.onAltStoreChange(state));

    //AltActions.getProfile();
  }

  componentWillUnmount() {
    //AltStore.unlisten((state) => this.onAltStoreChange(state));
  }

  onAltStoreChange(state) {
    this.setState({
      name: state.profile.name,
      gender: state.profile.gender,
      pic_source: state.profile.pic_source
    });
  }

  onActionSelected(position) {
    if (position === 0) { 
      AltActions.setProfile({name: this.state.name, gender: this.state.gender, pic_source: this.state.pic_source});
      Actions.pop(); 
      
    } 
  }
  
  save() {
    AltActions.setProfile({name: this.state.name, gender: this.state.gender, pic_source: this.state.pic_source});
    Actions.pop(); 
  }
  
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.imageBox}>
          <Image
            style={styles.image}
            source={this.state.pic_source} />
          <View style={styles.col}>
            <TextInput 
              style={styles.hello}
              onChangeText={(text) => this.setState({name: text})}
              value={this.state.name} 
            />
            <TextInput 
              style={styles.hello}
              onChangeText={(text) => this.setState({gender: text})}
              value={this.state.gender}
            />
            <TouchableHighlight
              style={styles.editPicButton}
              onPress={this.selectPhotoTapped.bind(this)}
              underlayColor="#202020">
              <Text style={styles.hello}>{'Change Profile Picture'}</Text>
            </TouchableHighlight>
            
            <Button onPress={this.save.bind(this)} style={{marginTop: 10}}>Save</Button>
          </View>
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  editPicButton: {
    flex: 0,
    borderWidth: 1
  },
  toolbar: {
   	height: 56,
    backgroundColor: '#e9eaed',
  },
  col: {
    flex: 1,
    flexDirection: 'column'
  },
  imageBox: {
    flex: 1,
    flexDirection: 'row'
  },
  image: {
      flex: 0,
      width: 200,
      height: 220
  },
  hello: {
    flex: 0,
    height: 40, 
    borderColor: 'gray', 
    borderWidth: 1
  }
});