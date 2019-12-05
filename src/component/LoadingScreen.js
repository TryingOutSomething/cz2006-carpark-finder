import React, { Component } from "react";
import { StyleSheet, Text, View, Animated } from "react-native";

export default class LoadingScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loadingText: this.props.loadingText,
      fromSearch: this.props.fromSearch
    };

    this.loadingSpin = new Animated.Value(0);
  }

  spinAnimation() {
    this.loadingSpin.setValue(0);
    Animated.sequence([
      Animated.timing(this.loadingSpin, {
        toValue: 1,
        duration: 600
      })
    ]).start(() => this.spinAnimation());
  }

  stopAnimation() {
    Animated.timing(this.loadingSpin).stop();
  }

  componentDidMount() {
    this.spinAnimation();
  }

  componentWillUnmount() {
    this.stopAnimation();
  }

  render() {
    const spin = this.loadingSpin.interpolate({
      inputRange: [0, 1],
      outputRange: ["0deg", "360deg"]
    });

    return (
      <View
        style={
          this.props.fromSearch
            ? styles.searchLoadingContainer
            : styles.mapLoadingContainer
        }
      >
        <Animated.Image
          style={{ transform: [{ rotate: spin }] }}
          source={require("../../assets/loading-process-128.png")}
        />
        <Text style={styles.loadingText}>{this.state.loadingText}</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mapLoadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },

  searchLoadingContainer: {
    flex: 1,
    alignItems: "center",
    marginTop: 20
  },

  loadingText: {
    textAlign: "center",
    marginTop: 10,
    fontSize: 17
  }
});
