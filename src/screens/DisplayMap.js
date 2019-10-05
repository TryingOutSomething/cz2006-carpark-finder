import React, { Component } from "react";
import { Dimensions, StyleSheet, Text, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, IconButton } from "react-native-paper";
import BottomDrawer from "rn-bottom-drawer";
import * as Permissions from "expo-permissions";
import * as Location from "expo-location";
import UserMarker from "../../assets/motorist-icon-32.png";

import DestinationRouter from "../components/DestinationRouter";

import {
  getCarparkInfo,
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
      showNearestCarparkResults: false,
      showResultsFromSearch: true,
      showDrawerButtons: true,
      isSearchingCarpark: false,
      showNearestCarparkBtn: true,
      timestamp: new Date().toLocaleTimeString()
    };

    this.carparkAvail = getCarparksAvailability.bind(this);
    this.getCarparkInfomation = getCarparkInfo.bind(this);
    this.updatedCarparkData = mergeCarparkData.bind(this);
    this.bookmarkCarPark = this.bookmarkCarPark.bind(this);
    this.isBookmarked = this.isBookmarked.bind(this);
    this.setBookmarkColour = this.setBookmarkColour.bind(this);
    this.chooseNextCarpark = this.chooseNextCarpark.bind(this);
    this.getNearbyCarparkLocations = this.getNearbyCarparkLocations.bind(this);
  }

  componentWillMount() {
    this.getCurrPos();

    const width = Dimensions.get("screen").width;
    const height = Dimensions.get("screen").height;
    const screenLongDelta = this.state.latDelta * (width / height);
    this.setState({ longDelta: screenLongDelta });
  }

  async getCurrPos() {
    let { status } = await Permissions.getAsync(Permissions.LOCATION);
    if (status !== "granted") {
      console.log("Permission is not granted!");
      this.props.navigation.navigate("denyLocation");
    }

    let location = await Location.getCurrentPositionAsync({});
    console.log(location);
    this.setState({
      userLat: location.coords.latitude,
      userLong: location.coords.longitude
    });
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

            this.setState(
              {
                nearest15Lots: result,
                isSearchingCarpark: false,
                showNearestCarparkBtn: false,
                showNearestCarparkResults: true
              },
              () => this.setBookmarkColour()
            );
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  bookmarkCarPark(carparkList) {
    let bookmarks = [...this.state.bookmarkList];

    if (this.isBookmarked(bookmarks, carparkList)) {
      bookmarks.pop();
      this.setState(
        {
          bookmarkList: bookmarks,
          bookmarkColour: "#CFD8DC"
        },
        () => console.log(this.state.bookmarkList)
      );
    } else {
      bookmarks.push(carparkList);
      this.setState(
        {
          bookmarkList: bookmarks,
          bookmarkColour: "#F57F17"
        },
        () => console.log(this.state.bookmarkList)
      );
    }
  }

  isBookmarked(bookmark, carparkList) {
    return bookmark.some(
      bookmark => carparkList.car_park_no === bookmark.car_park_no
    );
  }

  setBookmarkColour() {
    // Check if the current carpark is bookmarked or not
    if (this.isBookmarked(this.state.bookmarkList, this.state.nearest15Lots[0]))
      this.setState({ bookmarkColour: "#F57F17" });
    else this.setState({ bookmarkColour: "#CFD8DC" });
  }

  chooseNextCarpark() {
    let carparkLots = [...this.state.nearest15Lots];
    carparkLots.push(this.state.nearest15Lots[0]);
    carparkLots.shift();
    this.setState(
      {
        nearest15Lots: carparkLots
      },
      // Check if the current carpark is bookmarked or not
      () => this.setBookmarkColour()
    );
    console.log(this.state.bookmarkList);
  }

  render() {
    // todo add parameters for bookmark
    let fromSearch = this.props.navigation.getParam("searchCarpark", null);

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
            pinColor={"green"}
          >
            <Image source={UserMarker} />
          </Marker>

          {fromSearch && this.state.showResultsFromSearch ? (
            <DestinationRouter
              userCoord={{
                latitude: this.state.userLat,
                longitude: this.state.userLong
              }}
              destCoord={{
                latitude: fromSearch.loc.coordinates[1],
                longitude: fromSearch.loc.coordinates[0]
              }}
              address={fromSearch.address}
            />
          ) : this.state.showNearestCarparkResults ? (
            <DestinationRouter
              userCoord={{
                latitude: this.state.userLat,
                longitude: this.state.userLong
              }}
              destCoord={{
                latitude: this.state.nearest15Lots[0].loc.coordinates[1],
                longitude: this.state.nearest15Lots[0].loc.coordinates[0]
              }}
              address={this.state.nearest15Lots[0].address}
            />
          ) : null}
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

        {this.state.showNearestCarparkResults ? (
          <BottomDrawer
            containerHeight={250}
            startUp={true}
            backgroundColor={"#ffffff"}
            roundedEdges={true}
          >
            <View style={styles.drawerToolbarOptions}>
              <IconButton
                icon="bookmark"
                color={this.state.bookmarkColour}
                onPress={() =>
                  this.bookmarkCarPark(this.state.nearest15Lots[0])
                }
              />
              <IconButton
                icon="close"
                onPress={() =>
                  this.setState({
                    showNearestCarparkResults: false,
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

              {this.state.showDrawerButtons ? (
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
                    onPress={() => this.setState({ showDrawerButtons: false })}
                  />
                </View>
              ) : null}
            </View>
          </BottomDrawer>
        ) : fromSearch && this.state.showResultsFromSearch ? (
          <BottomDrawer
            containerHeight={250}
            startUp={true}
            backgroundColor={"#ffffff"}
            roundedEdges={true}
          >
            <View style={styles.drawerToolbarOptions}>
              <IconButton
                icon="bookmark"
                color={this.state.bookmarkColour}
                onPress={() => this.bookmarkCarPark(fromSearch)}
              />
              <IconButton
                icon="close"
                onPress={() =>
                  this.setState({
                    showResultsFromSearch: false,
                    showNearestCarparkBtn: true
                  })
                }
              />
            </View>

            <View style={styles.contentContainer}>
              <Text style={styles.text}>
                {fromSearch.address}
                {"\n\n"}
                Lots Available: {fromSearch.lots_available} /{" "}
                {fromSearch.total_lots}
                {"\n"}
                {fromSearch.car_park_type} {"\n"}
                {fromSearch.parking_system_type}
                {"\n"}
                {`Fetched at ${this.state.timestamp}`}
              </Text>
            </View>
          </BottomDrawer>
        ) : null}

        {(this.state.showNearestCarparkBtn && !fromSearch) ||
        (this.state.showNearestCarparkBtn &&
          !this.state.showResultsFromSearch) ? (
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
