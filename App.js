/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React, { Component } from 'react';
import { Platform, StyleSheet, Text, View, AsyncStorage } from 'react-native';
import firebase from 'react-native-firebase'

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  async componentDidMount() {
    this.checkPermission();
  }

  //1
  async checkPermission() {
    firebase.messaging().hasPermission()
      .then(enabled => {
        if (enabled) {
          console.log("Permission granted");
          this.getToken();
        } else {
          console.log("Request Permission");
          this.requestPermission();
        }
      });
  }

  //3
  async getToken() {
    let fcmToken = await AsyncStorage.getItem('fcmToken');
    console.log("before fcmToken: ", fcmToken);
    if (!fcmToken) {
      fcmToken = await firebase.messaging().getToken();
      if (fcmToken) {
        // user has a device token
        console.log("after fcmToken: ", fcmToken);
        await AsyncStorage.setItem('fcmToken', fcmToken);
      }
    }
  }

  //2
  async requestPermission() {
    firebase.messaging().requestPermission()
      .then(() => {
        this.getToken();
      })
      .catch(error => {
        console.log('permission rejected');
      });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome to React Native!</Text>
        <Text style={styles.instructions}>To get started, edit App.js</Text>
        <Text style={styles.instructions}>{instructions}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
