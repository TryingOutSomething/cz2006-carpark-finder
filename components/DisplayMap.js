import React, { Component } from "react";
import { StyleSheet, Text, View, Button } from "react-native";

export default class DisplayMap extends Component {
  static navigationOptions = {
    header: null
  };
  render() {
    return (
      <View style={styles.Container}>
        <Text>Search for a carpark info</Text>
        <Button
          title="Query Carpark"
          onPress={() => this.props.navigation.navigate("search")}
        />
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
