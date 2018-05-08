import React from 'react';
import { Button, Platform, StatusBar, StyleSheet, View, Text} from 'react-native';
import { AppLoading, Asset, Font } from 'expo';
import { Ionicons } from '@expo/vector-icons';
import RootNavigation from './navigation/RootNavigation';
import SwipeCards from './SwipeCards.js';
import firebaseConfig from './firebase_config.js';
import firebase from 'firebase';
import 'firebase/firestore';
import DataStore from './DataStore.js';

export default class App extends React.Component {
  constructor(){
    super();
     this.state = {
        isLoadingComplete: false,
        userId: 'benjamin_reinhardt',
        persons:[{name:'john doe'}],
        label:'Loc:SF'
      };
     
  }

  addTag = (subject) => {
    DataStore.addTag(subject, this.state.label, this.state.userId)
    .then((id)=>{console.log("created tag " + id)});
  }

  load = () => {
    console.log('loading!');
    DataStore.firebasePull(this.state.userId)
    .then((success)=>{
      console.log("firebase pulled!");
      DataStore.getAllPersons()
      .then((persons)=>{
        console.log("numpersons = " + persons.length);
        this.setState({persons:persons});
      });

    });
  }
    

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <AppLoading
          startAsync={this._loadResourcesAsync}
          onError={this._handleLoadingError}
          onFinish={this._handleFinishLoading}
        />
      );
    } else {
      return (
  
        <View style={styles.container}>
        <Button onPress={this.load} title="Load People" />
        <Text style={styles.text}> Does this person live in SF? </Text>
      	<SwipeCards style={{flex: 1}}
                    persons={this.state.persons}
                    addTag={this.addTag} />
         </View>

      );
    }
  }

  _loadResourcesAsync = async () => {
    return Promise.all([
      Asset.loadAsync([
        require('./assets/images/robot-dev.png'),
        require('./assets/images/robot-prod.png'),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free
        // to remove this if you are not using it in your app
        'space-mono': require('./assets/fonts/SpaceMono-Regular.ttf'),
      }),
    ]);
  };

  _handleLoadingError = error => {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  };

    _handleFinishLoading = () => {
    DataStore.getAllPersons()
     .then((persons)=>{
        console.log("numpersons = " + persons.length);
        this.setState({persons:persons, isLoadingComplete: true});
      });
  };
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  statusBarUnderlay: {
    height: 24,
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  text: {
    textAlign: 'center',
    marginTop: 200
  }
});
