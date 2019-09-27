import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, IconButton } from "react-native-paper";

import { getCurrentPosition } from "../controllers/CarParkDataHandler";

export default class DisplayMap extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();
    this.state = {
      userLat: 1.348406,
      userLong: 103.68306,
      latDelta: 0.0122,
      longDelta: 0.0421,
      errorMessage: "Please allow permission!"
    };

    this.getCurrPos = getCurrentPosition.bind(this);
  }

  componentWillMount() {
    this.getCurrPos()
      .then(location => {
        console.log(location);
        this.setState({
          userLat: location.coords.latitude,
          userLong: location.coords.longitude
        });
      })
      .catch(err => console.log(err));

    const width = Dimensions.get("screen").width;
    const height = Dimensions.get("screen").height;
    const screenLongDelta = this.state.latDelta * (width / height);
    this.setState({ longDelta: screenLongDelta });
  }

  render() {
    const { navigation } = this.props;
    const value = navigation.getParam("selectedCarpark", "");

    return (
      <View style={styles.container}>
        <MapView
          style={styles.map}
          initialRegion={{
            latitude: this.state.userLat,
            longitude: this.state.userLong,
            latitudeDelta: this.state.latDelta,
            longitudeDelta: this.state.longDelta
          }}
        >
          <Marker
            coordinate={{
              latitude: this.state.userLat,
              longitude: this.state.userLong
            }}
            title={"testing"}
            description={"testing123"}
            pinColor={"red"}
          />
        </MapView>

        <View style={styles.routingContainer}>
          <IconButton
            onPress={() => this.props.navigation.navigate("search")}
            icon="search"
          />
          <IconButton
            onPress={() => this.props.navigation.navigate("settings")}
            icon="settings"
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button
            style={styles.nearestCpButton}
            mode="contained"
            children="Nearest Carpark"
          ></Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  routingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "5%"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  nearestCpButton: {
    width: "80%",
    marginBottom: "10%"
  }
});
