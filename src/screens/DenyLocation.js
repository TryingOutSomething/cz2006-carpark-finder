import React, { Component } from "react";
import { Image, StyleSheet, View, Text } from "react-native";
import { Button } from "react-native-paper";

import * as IntentLauncher from "expo-intent-launcher";

export default class test extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    this.openSettings = this.openSettings.bind(this);
  }

  openSettings() {
    IntentLauncher.startActivityAsync(
      IntentLauncher.ACTION_LOCATION_SOURCE_SETTINGS
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={require("../../assets/location-disabled-128.png")} />
        <Text>
          {"\n"}Location is required to use this app! {"\n"}
        </Text>
        <Text>Please enable your location from Settings.</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center"
  }
});
