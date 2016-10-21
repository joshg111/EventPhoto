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

var ToolbarAndroid = require('ToolbarAndroid');
var toolbarActions = [];
    
export default class CreateFlow extends React.Component {
  constructor(props) {
    super(props);

    this.state = {}; 
    
  }
  
  render() {
    return (
      <View style={styles.container}>        
        <Text> hi </Text>
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