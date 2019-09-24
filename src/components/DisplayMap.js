import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class DisplayMap extends Component {
  static navigationOptions = {
    header: null
  };

  render() {
    const { navigation } = this.props;
    const value = navigation.getParam("selectedCarpark", "");

    return (
      <View style={styles.Container}>
        <Text>Search for a carpark info</Text>
        <Button
          title="Query Carpark"
          onPress={() => this.props.navigation.navigate("search")}
        />
        <Button
          title="Settings"
          onPress={() => this.props.navigation.navigate("settings")}
        />
        {value ? console.log(value) : null}
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
