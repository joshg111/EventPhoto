import React from 'react';
import {
  Linking,
  ListView,
  Platform,
  TouchableHighlight,
  StyleSheet,
  View,
  RefreshControl,
  Image
} from 'react-native';

import {Icon, Container, Content, Card, CardItem, Thumbnail, Text, Button } from 'native-base';

// Flux
import AltActions from '../../actions/actions';
import AltStore from '../../stores/store';

// React native screen router
import { Actions } from 'react-native-router-flux';
import Toolbar from '../../utils/toolbar'
var ToolbarAndroid = require('ToolbarAndroid');
var toolbarActions = [];
var MARGIN = 10; 
    
export default class MyEvents extends React.Component {
  constructor(props) {
    super(props);
   
    s = AltStore.getState()
    this.state = {
      dataSource: new ListView.DataSource({rowHasChanged: (row1, row2) => row1 !== row2}),
      name: s.profile.name,
      gender: s.profile.gender,
      pic_source: s.profile.pic_source
    };
    
    this.state.dataSource = this.state.dataSource.cloneWithRows(
    [
      {uri: 'http://www.pink-lemonade.org/images/events.jpg?crc=3994174537', title: 'Event Title', relTime: 'Coming up in 2 days'}, 
      {uri: 'http://fis-cal.com/wp-content/uploads/2013/10/EVENTS.png', title: 'Event Title', relTime: 'Coming up in 2 days'}
    ]);
    
  }

  componentDidMount() {
    AltStore.listen((state) => this.onAltStoreChange(state));

    //AltActions.getEvents();
  }

  componentWillUnmount() {
    AltStore.unlisten((state) => this.onAltStoreChange(state));
  }

  onAltStoreChange(state) {
    //this.setState({
    //  events: state.events
    //});
  }
  
  onActionSelected(position) {
    if (position === 0) { // index of 'Settings'
      Actions.EditProfile(); 
    } 
  }
  
  eventPress() {
    Actions.EditEvent();
  }
  
  renderListHeader(title, relTime) {
    return (
      <View style={styles.listHeader}>
        <Text > {title} </Text>
        <Text style={{flex: 1, fontSize: 12, color: 'gray', textAlign: 'center'}}> {relTime}</Text>
        <TouchableHighlight onPress={this.eventPress}> 
          <View>
            <Text>Edit</Text>
          </View>
        </TouchableHighlight>
      </View>
      
    );
  }
  
  renderListRow(event) {
    return (
      <View style={styles.viewList} >
        {this.renderListHeader(event.title, event.relTime)}
        <Image style={styles.image} source={{uri: event.uri}} />
      </View>
    );
  }
    
  renderList() {
    
    return (
      <View style={styles.hello}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={this.renderListRow.bind(this)}
        />
      </View>
    );    
  }
    
  createFlow() {
    Actions.CreateFlow();
  }
    
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.buttons}>
          <Button onPress={this.createFlow}><Icon name="ios-add" /> Create Flow</Button>
        </View>
        
        {this.renderList()}
        
      </View>
    );
  }
}

var styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  listHeader: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'stretch',
    justifyContent: 'space-around',
    alignSelf: 'stretch'
    
  },
  
  buttons: {
    flexDirection: "row",
    justifyContent: 'center',
    alignItems: "center",
    marginTop: MARGIN,
    marginLeft: MARGIN,
    marginRight: MARGIN,    
  },
  
  image: {
    flex: 4,    
  },
  viewList: {
    flex: 1,
    backgroundColor: 'pink',
    height: 150,
    marginTop: MARGIN,
    marginLeft: MARGIN,
    marginRight: MARGIN,    
  },  
  cardHeader: {
    flex: 1,
    flexDirection: 'row',
  },
  topbar: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'stretch',
    justifyContent: 'space-around'
  },
  toolbar: {
    flex: 1,
    backgroundColor: 'skyblue',
    justifyContent: 'center',
    alignItems: 'center',
  },
  myToolbar: {
    flex: 1,
    backgroundColor: 'black',
    
  },
  
  hello: {
    flex: 5,
    flexDirection: 'column',
    alignItems: 'stretch',
    
    //fontSize: 16,
    //textAlign: 'left',
    
  },
});