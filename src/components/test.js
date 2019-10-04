import React, { Component } from "react";
import { StyleSheet, View, Text, Button } from "react-native";
import { IconButton } from "react-native-paper";

export default class test extends Component {
  constructor() {
    super();

    this.test = this.test.bind(this);
  }

  test() {
    console.log("Hello");
    return (
      <Text>
        {JSON.stringify(this.props.navigation.getParam("selectedCarpark", ""))}
      </Text>
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          title="go to search"
          onPress={() => this.props.navigation.navigate("search")}
        />
        {this.props.navigation.getParam("selectedCarpark", null) ? (
          <View>{this.test()}</View>
        ) : (
          <Text>nothing</Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  }
});
