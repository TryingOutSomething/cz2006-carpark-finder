import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, IconButton } from "react-native-paper";
import BottomDrawer from "rn-bottom-drawer";

import {
  getCarparkInfo,
  getCurrentPosition,
  getCarparksAvailability,
  mergeCarparkData
} from "../controllers/CarParkDataHandler";

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
      nearest15Lots: undefined,
      bookmarkList: [],
      bookmarkColour: "#CFD8DC",
      isBookmarked: false,
      isDrawerShowing: false,
      isSearchingCarpark: false,
      showNearestCarparkBtn: true,
      timestamp: undefined
    };

    this.getCurrPos = getCurrentPosition.bind(this);
    this.carparkAvail = getCarparksAvailability.bind(this);
    this.getNearbyCarparkLocations = this.getNearbyCarparkLocations.bind(this);
    this.getCarparkInfomation = getCarparkInfo.bind(this);
    this.updatedCarparkData = mergeCarparkData.bind(this);
    this.bookmarkCarPark = this.bookmarkCarPark.bind(this);
    this.chooseNextCarpark = this.chooseNextCarpark.bind(this);
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

  getNearbyCarparkLocations() {
    this.setState({ isSearchingCarpark: true });

    this.getCarparkInfomation(this.state.userLong, this.state.userLat)
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
            let currentTime = new Date();
            this.setState({
              nearest15Lots: result,
              isDrawerShowing: true,
              isSearchingCarpark: false,
              showNearestCarparkBtn: false,
              timestamp: currentTime.toLocaleTimeString()
            });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  bookmarkCarPark() {
    let bookmarks = [...this.state.bookmarkList];

    if (bookmarks.includes(this.state.nearest15Lots[0])) {
      bookmarks.pop();
      this.setState({
        isBookmarked: false,
        bookmarkColour: "#CFD8DC",
        bookmarkList: bookmarks
      });
    } else {
      bookmarks.push(this.state.nearest15Lots[0]);
      this.setState({
        isBookmarked: true,
        bookmarkColour: "#F57F17",
        bookmarkList: bookmarks
      });
    }
    console.log(this.state.bookmarkList);
  }

  chooseNextCarpark() {
    let carparkLots = [...this.state.nearest15Lots];
    carparkLots.push(this.state.nearest15Lots[0]);
    carparkLots.shift();
    this.setState({
      nearest15Lots: carparkLots
    });
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
            title={"You"}
            description={`${this.state.userLat}, ${this.state.userLong}`}
            pinColor={"red"}
          />
        </MapView>

        <View style={styles.routingContainer}>
          <IconButton
            onPress={() => this.props.navigation.navigate("search")}
            icon="search"
          />
          <IconButton
            onPress={() =>
              this.props.navigation.navigate("settings", {
                bookmarkList: this.state.bookmarkList
              })
            }
            icon="settings"
          />
        </View>

        {this.state.isDrawerShowing ? (
          <BottomDrawer
            containerHeight={250}
            startUp={true}
            backgroundColor={"#ffffff"}
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
                onPress={() =>
                  this.setState({
                    isDrawerShowing: false,
                    showNearestCarparkBtn: true
                  })
                }
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                {this.state.nearest15Lots[0].address} {"\n\n"}
                Lots Available: {
                  this.state.nearest15Lots[0].lots_available
                } / {this.state.nearest15Lots[0].total_lots} {"\n"}
                {this.state.nearest15Lots[0].car_park_type} {"\n"}
                {this.state.nearest15Lots[0].parking_system_type} {"\n"}
                {`Fetched at ${this.state.timestamp}`}
              </Text>
              <View style={styles.drawerButtonContainer}>
                <Button
                  style={styles.drawerAnotherButton}
                  mode="outlined"
                  color="#FF3D00"
                  children="ANOTHER"
                  onPress={() => this.chooseNextCarpark()}
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

        {this.state.showNearestCarparkBtn ? (
          <View style={styles.buttonContainer}>
            <Button
              style={styles.nearestCpButton}
              mode="contained"
              children="Nearest Carpark"
              loading={this.state.isSearchingCarpark}
              onPress={() => this.getNearbyCarparkLocations()}
            ></Button>
          </View>
        ) : null}
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
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },

  drawerButtonContainer: {
    flexDirection: "row"
  },
  text: {
    paddingHorizontal: 5
  },

  drawerToolbarOptions: {
    flexDirection: "row",
    justifyContent: "space-between"
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
