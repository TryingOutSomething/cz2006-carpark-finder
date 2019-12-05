import React, { Component } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export default class NoBookmarks extends Component {
  constructor() {
    super();
  }

  render() {
    return (
      <View style={styles.noBookmarksContainer}>
        <Image source={require("../../assets/bookmark-64.png")} />
        <Text style={styles.noBookmarksText}>No Bookmarks!</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  noBookmarksContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10
  },

  noBookmarksText: {
    fontSize: 15
  }
});
