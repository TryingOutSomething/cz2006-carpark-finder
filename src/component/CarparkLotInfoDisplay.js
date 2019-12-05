import React, { Component } from "react";
import { Text, View } from "react-native";

import DisplayMapStyles from "../styles/DisplayCarparkStyles";

/**
 * This class implements the bottom drawer interface with 
 * the destination carpark info
 * 
 * @author
 */
export default class CarparkInfoDisplay extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View>
        <Text style={styles.textHeader}>{this.props.carparkLot.address}</Text>
        <Text style={styles.textBody}>
          Lots Available: {this.props.carparkLot.lots_available} /{" "}
          {this.props.carparkLot.total_lots} {"\n"}
          Carpark Type: {this.props.carparkLot.car_park_type} {"\n"}
          Parking Type: {this.props.carparkLot.parking_system_type}
        </Text>
      </View>
    );
  }
}

const styles = DisplayMapStyles;
