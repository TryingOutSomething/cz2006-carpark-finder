import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default class NoBookmarks extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.noResultContainer}>
        <Image source={require("../../assets/zoom-out-128.png")} />
        <Text style={styles.fetchingData}>No Results!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noResultContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },

  fetchingData: {
    marginTop: 5,
    fontSize: 17
  }
});
