import React, { Component } from "react";
import { Dimensions, View, Image } from "react-native";
import MapView, { Marker } from "react-native-maps";
import { Button, IconButton } from "react-native-paper";
import BottomDrawer from "rn-bottom-drawer";
import * as Location from "expo-location";
import UserMarker from "../../assets/motorist-icon-32.png";

import { getNearbyCarparks } from "../controllers/CarParkDataHandler";
import { getCurrentLocation } from "../controllers/LocationHandler";

import DisplayMapStyles from "../styles/DisplayCarparkStyles";
import LoadingScreen from "../component/LoadingScreen";

import CarparkLotInfoDisplay from "../component/CarparkLotInfoDisplay";
import DestinationRouter from "../component/DestinationRouter";

import {
  bookmarkColour,
  unbookmarkColour,
  defaultUserLat,
  defaultUserLong,
  defaultLatDelta,
  defaultLongDelta
} from "../styles/DefaultVariables";

const width = Dimensions.get("screen").width;
const height = Dimensions.get("screen").height;

/**
 * This class implements the display of map with makers of
 * user's location and nearest carparks around them
 *
 * @author Jan Owyeong
 */
export default class DisplayMap extends Component {
  static navigationOptions = {
    header: null
  };

  constructor() {
    super();

    watchId = undefined;

    this.state = {
      userLat: defaultUserLat,
      userLong: defaultUserLong,
      latDelta: defaultLatDelta,
      longDelta: defaultLongDelta,
      nearest15Lots: undefined,
      bookmarkList: [],
      bookmarkColour: unbookmarkColour,
      showNearestCarparkResults: false,
      showResultsFromSearch: true,
      showResultsFromBookmark: true,
      isSearchingCarpark: false,
      showNearestCarparkBtn: true,
      permissionGranted: false
    };

    this.getNearbyCarparks = getNearbyCarparks.bind(this);
    this.getCurrentLocation = getCurrentLocation.bind(this);
  }

  /**
   * This function will request for user's location from their device
   * and displays it on the map
   *
   * @author Jan Owyeong
   */
  componentWillMount() {
    this.requestCurrentLocation();
  }

  /**
   * This function will track user's location and update the
   * user's location on the map
   *
   * @author Jan Owyeong
   */
  componentDidMount() {
    this.watchUserLocation();
  }

  /**
   * This function will unsubscribe tracking of
   * user's location when exiting the app
   *
   * @author Jan Owyeong
   */
  componentWillUnmount() {
    console.log("Unsubscribing watch location now...");
    this.watchId.remove();
  }

  requestCurrentLocation() {
    this.getCurrentLocation()
      .then(userLocation => {
        if (!userLocation) {
          console.log("Permission is not granted!");
          this.displayDenyLocationScreen();
          return;
        }
        this.displayCurrentLocation(userLocation);
      })
      .catch(err => console.log(err));
  }

  displayCurrentLocation(userLocation) {
    const screenLongDelta = this.state.latDelta * (width / height);
    this.setState({
      userLat: userLocation.coords.latitude,
      userLong: userLocation.coords.longitude,
      longDelta: screenLongDelta,
      permissionGranted: true
    });
  }

  displayDenyLocationScreen() {
    this.props.navigation.navigate("denyLocation");
  }

  watchUserLocation() {
    // To track user's location every 5 seconds or every 500m.
    this.watchId = Location.watchPositionAsync(
      {
        // Manages the accuracy of location. Currently set to accurate to within 100m
        accuracy: Location.Accuracy.Balanced,
        // Interval to get updated location. Currently set to 1s
        timeInterval: 1000,
        distanceInterval: 0
      },
      location => {
        this.setState(
          {
            userLat: location.coords.latitude,
            userLong: location.coords.longitude
          },
          () =>
            console.log(
              `Lat: ${this.state.userLat} Long: ${this.state.userLong}`
            )
        );
      }
    ).catch(err => console.log(err));
  }

  requestNearbyCarparks() {
    this.setState({ isSearchingCarpark: true });

    this.getNearbyCarparks(this.state.userLong, this.state.userLat)
      .then(carparkList => this.displayNearestCarpark(carparkList))
      .catch(err => console.log(err));
  }

  displayNearestCarpark(carparkList) {
    this.setState(
      {
        nearest15Lots: carparkList,
        isSearchingCarpark: false,
        showNearestCarparkBtn: false,
        showNearestCarparkResults: true
      },
      () => this.setBookmarkColour()
    );
  }

  bookmarkCarpark(carpark) {
    let bookmarks = [...this.state.bookmarkList];

    if (this.isBookmarked(bookmarks, carpark)) {
      bookmarks.pop();
      this.setState({
        bookmarkList: bookmarks,
        bookmarkColour: unbookmarkColour
      });
    } else {
      bookmarks.push(carpark);
      this.setState({
        bookmarkList: bookmarks,
        bookmarkColour: bookmarkColour
      });
    }
  }

  setBookmarkColour() {
    if (this.isBookmarked(this.state.bookmarkList, this.state.nearest15Lots[0]))
      this.setState({ bookmarkColour: bookmarkColour });
    else this.setState({ bookmarkColour: unbookmarkColour });
  }

  isBookmarked(bookmark, carparkList) {
    // To check if the current car park exists in the bookmark list
    return bookmark.some(
      bookmark => carparkList.car_park_no === bookmark.car_park_no
    );
  }

  chooseNextCarpark() {
    let carparkLots = [...this.state.nearest15Lots];
    carparkLots.push(this.state.nearest15Lots[0]);
    carparkLots.shift();
    this.setState(
      {
        nearest15Lots: carparkLots
      },
      () => {
        // To check if the current car park lot is bookmarked
        this.setBookmarkColour();
      }
    );
  }

  /**
   * Renders the map and markers on the phone screen
   *
   * @author Jan Owyeong
   */
  render() {
    let fromSearch = this.props.navigation.getParam("searchCarpark", null);
    let fromSettings = this.props.navigation.getParam("bookmarkCarpark", null);

    return (
      <View style={styles.container}>
        {this.state.permissionGranted ? (
          <View style={styles.container}>
            <MapView
              style={styles.map}
              region={{
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
              ) : fromSettings && this.state.showResultsFromBookmark ? (
                <DestinationRouter
                  userCoord={{
                    latitude: this.state.userLat,
                    longitude: this.state.userLong
                  }}
                  destCoord={{
                    latitude: fromSettings.loc.coordinates[1],
                    longitude: fromSettings.loc.coordinates[0]
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
                      this.bookmarkCarpark(this.state.nearest15Lots[0])
                    }
                  />
                  <IconButton
                    icon="close"
                    onPress={() =>
                      this.setState({
                        showNearestCarparkResults: false,
                        showNearestCarparkBtn: true,
                        bookmarkColour: unbookmarkColour
                      })
                    }
                  />
                </View>

                <View style={styles.contentContainer}>
                  <CarparkLotInfoDisplay
                    carparkLot={this.state.nearest15Lots[0]}
                  />

                  <Button
                    style={styles.drawerAnotherButton}
                    mode="outlined"
                    color="#01579B"
                    children="ANOTHER"
                    onPress={() => this.chooseNextCarpark()}
                  />
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
                    onPress={() => this.bookmarkCarpark(fromSearch)}
                  />
                  <IconButton
                    icon="close"
                    onPress={() =>
                      this.setState({
                        showResultsFromSearch: false,
                        showNearestCarparkBtn: true,
                        bookmarkColour: unbookmarkColour
                      })
                    }
                  />
                </View>

                <View style={styles.contentContainer}>
                  <CarparkLotInfoDisplay carparkLot={fromSearch} />
                </View>
              </BottomDrawer>
            ) : fromSettings && this.state.showResultsFromBookmark ? (
              <BottomDrawer
                containerHeight={250}
                startUp={true}
                backgroundColor={"#ffffff"}
                roundedEdges={true}
              >
                <View style={styles.drawerToolbarOptions}>
                  <IconButton
                    icon="bookmark"
                    color={bookmarkColour}
                    onPress={() => this.bookmarkCarpark(fromSettings)}
                  />
                  <IconButton
                    icon="close"
                    onPress={() =>
                      this.setState({
                        showResultsFromBookmark: false,
                        showNearestCarparkBtn: true,
                        bookmarkColour: unbookmarkColour
                      })
                    }
                  />
                </View>

                <View style={styles.contentContainer}>
                  <CarparkLotInfoDisplay carparkLot={fromSettings} />
                </View>
              </BottomDrawer>
            ) : null}

            {(this.state.showNearestCarparkBtn &&
              !fromSearch &&
              !fromSettings) ||
            (this.state.showNearestCarparkBtn &&
              !this.state.showResultsFromBookmark &&
              !this.state.showResultsFromSearch) ||
            (this.state.showNearestCarparkBtn &&
              !this.state.showResultsFromSearch &&
              !fromSettings) ? (
              <View style={styles.buttonContainer}>
                <Button
                  style={styles.nearestCpButton}
                  mode="contained"
                  children="Nearest Carpark"
                  loading={this.state.isSearchingCarpark}
                  onPress={() => this.requestNearbyCarparks()}
                ></Button>
              </View>
            ) : null}
          </View>
        ) : (
          <LoadingScreen loadingText="Loading map..." />
        )}
      </View>
    );
  }
}

const styles = DisplayMapStyles;
