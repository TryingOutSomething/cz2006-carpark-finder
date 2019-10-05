import React, { Component } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { IconButton } from "react-native-paper";

export default class test extends Component {
  constructor() {
    super();
  }

  render() {
    let fromSearch = this.props.navigation.getParam("selectedCarpark", null);
    return <View>{fromSearch ? <Text>hello</Text> : <Text>bye</Text>}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
});
