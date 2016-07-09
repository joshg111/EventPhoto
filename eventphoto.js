import React from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  View
} from 'react-native';

//////////////////////////////////

// 3rd party libraries
import {
  Actions,
  Router,
  Scene,
  TabBar,
} from 'react-native-router-flux';

// Views
import ProfileView from './app/views/main/profile';
import EditProfileView from './app/views/main/editProfile';
import MyEvents from './app/views/main/myEvents';
import EditEvent from './app/views/main/editEvent';


// @todo remove when RN upstream is fixed
//console.ignoredYellowBox = [
//  'Warning: In next release empty section headers will be rendered.',
//  'Warning: setState(...): Can only update a mounted or mounting component.',
//];


var styles = StyleSheet.create({
  tabs: {
    top: 0,
    position: "relative",
  },
});

const scenes = Actions.create(
  <Scene key="root" hideNavBar={true}>
    <Scene key="main" title="Main" hideNavBar={true} component={ProfileView} />
    <Scene key="EditProfile" direction="vertical" hideNavBar={true} title="EditProfile" component={EditProfileView} />
    <Scene key="MyEvents" direction="vertical" hideNavBar={true} title="MyEvents" initial={true} component={MyEvents} />
    <Scene key="EditEvent" direction="vertical" hideNavBar={true} title="EditEvent" component={EditEvent} />
    
    
  </Scene>
);

export default class Periods extends React.Component {
  render() {
    return <Router scenes={scenes} />;
  }
}