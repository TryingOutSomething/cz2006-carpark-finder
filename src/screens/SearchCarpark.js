import React, { Component } from "react";
import { FlatList, Keyboard, Text, TouchableOpacity, View } from "react-native";

import { IconButton, TextInput } from "react-native-paper";

import {
  getSearchCarpark,
  updateCarparkWithLotAvailability
} from "../controllers/CarParkDataHandler";

import NoSearchResults from "../component/NoSearchResults";
import LoadingScreen from "../component/LoadingScreen";
import {
  headerBackgroundColour,
  headerTitleColour
} from "../styles/DefaultVariables";

import SearchCarParkStyles from "../styles/SearchCarparkStyles";

/**
 * This class implements the display of carparks base on user's
 * text input
 * 
 * @author Yap Rong En
 */
export default class SearchCarparks extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: "Search Carparks",
    headerStyle: {
      backgroundColor: headerBackgroundColour
    },
    headerTitleStyle: {
      color: headerTitleColour
    },
    headerTintColor: headerTitleColour,

    headerRight: (
      <IconButton
        onPress={() => navigation.navigate("settings")}
        icon="settings"
        color={headerTitleColour}
      />
    )
  });

  constructor() {
    super();
    this.state = {
      carParkInfo: undefined,
      isFetching: false
    };

    this.getSearchCarpark = getSearchCarpark.bind(this);
    this.updateCarparkWithLotAvailability = updateCarparkWithLotAvailability.bind(
      this
    );
  }

  /**
   * This function quries a list of carpark info base on user's input of
   * carpark address name.
   *
   * @author Yap Rong En
   */
  requestCarparkList(carparkAddress) {
    if (!carparkAddress) return;
    this.setState({ isFetching: true });

    // Search the address of carpark in the database using the input
    this.getSearchCarpark(carparkAddress).then(value => {
      this.setState({ carParkInfo: value, isFetching: false });
    });
  }

  /**
   * Get total number of lots & lot availability and them into
   * the selected carpark. Passes the info to display on the map
   * 
   * @author Yap Rong En
   */
  prepareRouteOnMap(carpark) {
    let carparkLot = [carpark];

    this.updateCarparkWithLotAvailability(carparkLot)
      .then(updatedCarparkLot => this.displayOnMap(updatedCarparkLot[0]))
      .catch(err => console.log(err));
  }

  displayOnMap(updatedCarparkLot) {
    this.props.navigation.navigate("home", {
      searchCarpark: updatedCarparkLot
    });
  }

  render() {
    return (
      <View>
        <View style={styles.searchContainer}>
          <View style={styles.searchWithText}>
            <TextInput
              style={styles.TextArea}
              onChangeText={text => this.setState({ textInput: text })}
              value={this.state.textInput}
              mode="flat"
              placeholder="Search Carpark"
              underlineColor="#01579B"
            />
            <IconButton
              style={styles.Button}
              onPress={() => {
                Keyboard.dismiss();
                this.requestCarparkList(this.state.textInput);
              }}
              icon="search"
              animated={true}
            />
          </View>
          <View style={styles.List}>
            {this.state.isFetching ? (
              <LoadingScreen
                fromSearch={true}
                loadingText="Fetching carparks..."
              />
            ) : null}

            {this.state.carParkInfo && !this.state.isFetching ? (
              <FlatList
                data={this.state.carParkInfo}
                renderItem={({ item }) => (
                  <View>
                    <TouchableOpacity
                      style={styles.ListItem}
                      onPress={() => {
                        this.prepareRouteOnMap(item);
                      }}
                    >
                      <Text>{item.address}</Text>
                    </TouchableOpacity>
                  </View>
                )}
                keyExtractor={item => item._id.toString()}
                ListEmptyComponent={<NoSearchResults />}
              />
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = SearchCarParkStyles;
