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
import AltActions from '../actions/actions';
import AltStore from '../stores/store';

// React native screen router
import { Actions } from 'react-native-router-flux';
import Tabs from 'react-native-tabs';

var ToolbarAndroid = require('ToolbarAndroid');
var toolbarActions = [];
    
export default class Toolbar extends React.Component {
  constructor(props) {
    super(props);

  }

  changeScreen(name) {
    if (name == "Profile") {
      Actions.main()
    }
    else if (name == "MyEvents") {
      Actions.MyEvents()
    }
  }
  
  render() {
    return (
      <View style={styles.container}>
        <Tabs selected={this.props.page} style={styles.tabs}
            selectedStyle={{color:'red'}} onSelect={el=>this.changeScreen(el.props.name)}>
          <Text name="Profile">Profile</Text>
          <Text name="MyEvents">My Events</Text>
        </Tabs>
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1
  },
  tabs: {
    flex: 0,
    backgroundColor:'white',
    height: 55
    
  }
});