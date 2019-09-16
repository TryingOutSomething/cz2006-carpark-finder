import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class DisplayMap extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.Container}>
        <Text>Settings Page</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    Container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    }
});
