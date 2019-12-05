import React, { Component } from "react";
import { Image, View, Text } from "react-native";
import { Button } from "react-native-paper";

import * as IntentLauncher from "expo-intent-launcher";

import DenyLocationStyles from "../styles/DenyLocationStyles";

export default class DenyLocation extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.openSettings = this.openSettings.bind(this);
  }

  /**
   * This function launches the application settings to enable location
   * permission for the app
   * 
   * @author Thung Jia Cheng
   */
  openSettings() {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_APPLICATION_SETTINGS
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/location-disabled-128.png")} />
        <Text style={styles.message}>
          {"\n"}Location is required to use this app! {"\n\n"}
          Please enable your location from Settings.
        </Text>
        <Button
          mode="text"
          children="Settings"
          color="#009688"
          onPress={() => this.openSettings()}
        />
      </View>
    );
  }
}

const styles = DenyLocationStyles;
