import React, { Component } from "react";
import {
  FlatList,
  Picker,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from "react-native";

export default class Settings extends Component {
  static navigationOptions = {
    headerTitle: "Settings"
  };

  constructor() {
    super();
    this.state = {
      language: "English"
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Bookmarks:</Text>
        <FlatList
          style={styles.bookmarkListScroll}
          data={this.props.navigation.getParam("bookmarkList", null)}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  console.log(item);
                }}
              >
                <Text>{item.address}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item._id.toString()}
          ListEmptyComponent={
            <Text style={styles.noBookmarks}>No Bookmarks</Text>
          }
        />
        <Text>{"\n\n\n\n"}</Text>
        <Text>Other Settings:</Text>
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
        <View style={styles.credits}>
          <Text>Software Engineering group SSP3 testytest</Text>
          <Text>Icons from Those Icons @ FlatIcon</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
    marginHorizontal: 10
  },

  bookmarkListScroll: {
    height: "30%"
  },

  noBookmarks: {
    textAlign: "center"
  },

  listItem: {
    padding: 5,
    marginHorizontal: 16
  },

  languageOption: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5
  },

  languageText: {
    textAlign: "center",
    alignSelf: "center",
    fontSize: 16
  },

  picker: {
    width: "30%"
  },

  credits: {}
});
