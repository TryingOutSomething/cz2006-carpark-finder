import React, { Component } from "react";
import { View } from "react-native";
import { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

import { GOOGLE_MAPS_APIKEY } from "react-native-dotenv";

/**
 * This class implements the route from user's location to 
 * destination location
 * 
 * @author Jan Owyeong
 */
export default class DestinationRouter extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Marker
          coordinate={{
            latitude: this.props.destCoord.latitude,
            longitude: this.props.destCoord.longitude
          }}
          title={"Destination"}
          description={`${this.props.address}`}
          pinColor={"red"}
        />
        <MapViewDirections
          origin={{
            latitude: this.props.userCoord.latitude,
            longitude: this.props.userCoord.longitude
          }}
          destination={{
            latitude: this.props.destCoord.latitude,
            longitude: this.props.destCoord.longitude
          }}
          apikey={GOOGLE_MAPS_APIKEY}
          strokeWidth={5}
          strokeColor="#039BE5"
        />
      </View>
    );
  }
}
