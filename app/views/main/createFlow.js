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
  Image
} from 'react-native';

// Flux
import AltActions from '../../actions/actions';
import AltStore from '../../stores/store';

// React native screen router
import { Actions } from 'react-native-router-flux';

import {Icon, Container, Content, Card, CardItem, Thumbnail, Button } from 'native-base';

var ImagePicker = require('react-native-image-picker');

var ToolbarAndroid = require('ToolbarAndroid');
var toolbarActions = [];
    
export default class CreateFlow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}; 
    
  }
  
  componentDidMount() {
    this.takeImage(); 
    
    
  }
  
  renderContact() {
    var res; 
    if (!this.state.reqTarget)
    {
      res = <Text> Choose a person from your contacts to send a photo request </Text>;
    }
    return res; 
  }
  
  takeImage() {
    
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

    ImagePicker.launchCamera(options, (response)  => {
      console.log('Response = ', response);

      if (response.didCancel) {
        console.log('User cancelled image taker');
        Actions.pop(); 
      }
      else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      }
      else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      }
      
      else {
        var source;
        source = {uri: 'data:image/jpeg;base64,' + response.data, isStatic: true};

        this.setState({
          pic_source: source
        });
      }
    });
    
  }
  
  renderImage() {
    if (this.state.pic_source)
    {
      return <Image
          style={styles.image}
          source={this.state.pic_source} />; 
    }
  }
  
  
  render() {
    return (
      <View style={styles.container}>        
        {this.renderImage()}  
        {this.renderContact()}
        <Button onPress={Actions.ChooseContact}> Choose Contact </Button>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      
  },
  
  toolbar: {
    flex: 1,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
      flex: 0,
      width: 200,
      height: 220
  },
  body: {
    flex: 10
  },
});