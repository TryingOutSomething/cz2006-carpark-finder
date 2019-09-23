import React, { Component } from "react";
import { StyleSheet, Text, View } from "react-native";

export default class DisplayMap extends Component {
  render() {
    return (
      <View style={styles.Container}>
        <Text>Hello World from settings</Text>
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
