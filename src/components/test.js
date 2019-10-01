import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Button, IconButton } from "react-native-paper";
import BottomDrawer from "rn-bottom-drawer";

import {
  getNearbyCarparks as getCarparkInfo,
  getCurrentPosition,
  getCarparksAvailability,
  mergeCarparkData
} from "../controllers/CarParkDataHandler";

const TAB_BAR_HEIGHT = 49;
const HEADER_HEIGHT = 60;

export default class test extends Component {
  constructor() {
    super();
    this.state = {
      nearest15Lots: undefined,
      bookmarkList: [],
      bookmarkColour: "#ECEFF1",
      isBookmarked: false,
      isAnotherButtonLoading: false,
      isDrawerShowing: false
    };

    this.currPos = getCurrentPosition.bind(this);
    this.carparkAvail = getCarparksAvailability.bind(this);
    this.currLoc = this.currLoc.bind(this);
    this.getLoc = getCarparkInfo.bind(this);
    this.updatedCarparkData = mergeCarparkData.bind(this);
    this.bookmarkCarPark = this.bookmarkCarPark.bind(this);
  }

  currLoc() {
    let lat = 1.2850879;
    let long = 103.82558;

    /** Temporary commented
     * this.currPos()
      .then(location => {
        lat = location.coords.latitude;
        long = location.coords.longitude;

        if (!lat && !long) return;

        this.getLoc(long, lat)
          .then(location => console.log(location))
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
    */

    this.getLoc(long, lat)
      .then(location => {
        /** Fetch the nearset carparks within a 5km radius from the current location
         *  and retain the nearest 15 locations if the length of the array is
         *  more than 15.
         */
        let first15Lots = "";
        if (location.length > 15) first15Lots = location.slice(0, 15);
        else first15Lots = location;

        this.carparkAvail()
          .then(lots => {
            let result = this.updatedCarparkData(lots, first15Lots);
            this.setState({ nearest15Lots: result, isDrawerShowing: true });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  bookmarkCarPark() {
    if (this.state.bookmarkList.includes(this.state.nearest15Lots[0])) {
      this.state.bookmarkList.pop();
      this.setState({ isBookmarked: false, bookmarkColour: "#ECEFF1" });
    } else {
      this.state.bookmarkList.push(this.state.nearest15Lots[0]);
      this.setState({ isBookmarked: true, bookmarkColour: "#FFFF00" });
    }
    console.log(this.state.bookmarkList);
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => this.currLoc()}
          mode="contained"
          children="current location"
        />

        {this.state.isDrawerShowing ? (
          <BottomDrawer
            containerHeight={250}
            offset={TAB_BAR_HEIGHT + HEADER_HEIGHT}
            startUp={true}
            backgroundColor={"#fffff0"}
            roundedEdges={true}
            onExpanded={() => {
              console.log("exapnd");
            }}
            onCollapsed={() => {
              console.log("collapsed");
            }}
          >
            <View style={styles.drawerToolbarOptions}>
              <IconButton
                icon="bookmark"
                color={this.state.bookmarkColour}
                onPress={() => this.bookmarkCarPark()}
              />
              <IconButton
                icon="close"
                onPress={() => this.setState({ isDrawerShowing: false })}
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                {this.state.nearest15Lots[0].address} {"\n\n"}
                Lots Available: {
                  this.state.nearest15Lots[0].lots_available
                } / {this.state.nearest15Lots[0].total_lots} {"\n"}
                {this.state.nearest15Lots[0].car_park_type} {"\n"}
                {this.state.nearest15Lots[0].parking_system_type}
              </Text>
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.drawerAnotherButton}
                  mode="outlined"
                  color="#FF3D00"
                  children="ANOTHER"
                  loading={this.state.isAnotherButtonLoading}
                  onPress={() => {
                    this.setState({
                      isAnotherButtonLoading: !this.state.isAnotherButtonLoading
                    });
                    console.log("first buttom pressed");
                  }}
                />
                <Button
                  style={styles.drawerOkButton}
                  mode="outlined"
                  color="#0023FF"
                  children="OK"
                  onPress={() => console.log("second buttom pressed")}
                />
              </View>
            </View>
          </BottomDrawer>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center"
  },
  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },
  buttonContainer: {
    flexDirection: "row"
  },
  text: {
    paddingHorizontal: 5
  },

  drawerToolbarOptions: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  drawerAnotherButton: {
    marginRight: "2%",
    width: 150
  },

  drawerOkButton: {
    marginLeft: "2%",
    width: 150
  }
});
