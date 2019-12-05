import React, { Component } from "react";
import { FlatList, Picker, Text, TouchableOpacity, View } from "react-native";

import {
  headerBackgroundColour,
  headerTitleColour
} from "../styles/DefaultVariables";

import { updateCarparkWithLotAvailability } from "../controllers/CarParkDataHandler";

import NoBoomarks from "../component/NoBookmarks";
import SettingStyles from "../styles/SettingStyles";

/**
 * This class implements the settings option of the app
 *
 * @author
 */
export default class Settings extends Component {
  static navigationOptions = {
    headerTitle: "Settings",
    headerStyle: {
      backgroundColor: headerBackgroundColour
    },
    headerTitleStyle: {
      color: headerTitleColour
    },
    headerTintColor: headerTitleColour
  };

  constructor() {
    super();
    this.state = {
      language: "English"
    };

    this.updateCarparkWithLotAvailability = updateCarparkWithLotAvailability.bind(
      this
    );
  }

  prepareRouteOnMap(carpark) {
    let carparkLot = [carpark];

    this.updateCarparkWithLotAvailability(carparkLot)
      .then(updatedCarparkLot => {
        this.displayOnMap(updatedCarparkLot[0]);
      })
      .catch(err => console.log(err));
  }

  displayOnMap(updatedCarparkLot) {
    this.props.navigation.navigate("home", {
      bookmarkCarpark: updatedCarparkLot
    });
  }

  render() {
    return (
      <View style={styles.container}>
        <Text style={styles.titleHeader}>Bookmarks:</Text>
        <FlatList
          style={styles.bookmarkListScroll}
          data={this.props.navigation.getParam("bookmarkList", null)}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  this.prepareRouteOnMap(item);
                }}
              >
                <Text>{item.address}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item._id.toString()}
          ListEmptyComponent={<NoBoomarks />}
        />
        <Text>{"\n\n\n\n"}</Text>
        <Text style={styles.titleHeader}>Other Settings:</Text>
        <View style={styles.languageOption}>
          <Text style={styles.languageText}>Language</Text>
          <Picker
            style={styles.picker}
            selectedValue={this.state.language}
            onValueChange={(itemValue, itemIndex) =>
              this.setState({ language: itemValue })
            }
          >
            <Picker.Item label="English" value="english" />
          </Picker>
        </View>
        <Text>{"\n"}</Text>
        <View>
          <Text style={styles.credits}>
            Software Engineering group SSP3 testytest {"\n"}
            Icons designed by Chanut, Freepik, Smashicons and Those Icons @
            FlatIcon
          </Text>
        </View>
      </View>
    );
  }
}

const styles = SettingStyles;
