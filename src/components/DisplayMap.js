import React, { Component } from "react";
import { Button, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";

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
      <View style={styles.Container}>
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
      </View>
    );
  }
}

const styles = StyleSheet.create({
  Container: {
    flex: 1
  },
  map: {
    ...StyleSheet.absoluteFillObject
  }
});
