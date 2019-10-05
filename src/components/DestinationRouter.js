import React, { Component } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { GOOGLE_MAPS_APIKEY } from "react-native-dotenv";

class DestinationRouter extends Component {
  constructor(props) {
    super(props);
    this.state = {
      originCoord: {
        latitude: this.props.userCoord.latitude,
        longitude: this.props.userCoord.longitude
      },

      destinationCoord: {
        latitude: this.props.destCoord.latitude,
        longitude: this.props.destCoord.longitude
      },

      destinationAddress: this.props.address
    };
  }

  render() {
    return (
      <View>
        <Marker
          coordinate={this.state.destinationCoord}
          title={"Destination"}
          description={`${this.state.destinationAddress}`}
          pinColor={"red"}
        />
        <MapViewDirections
          origin={this.state.originCoord}
          destination={this.state.destinationCoord}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="red"
        />
      </View>
    );
  }
}

export default DestinationRouter;
