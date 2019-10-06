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
      language: "English",
      items: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]
    };
  }
  render() {
    return (
      <View style={styles.container}>
        <Text>Bookmarks:</Text>
        <FlatList
          style={styles.bookmarkListScroll}
          data={this.state.items}
          renderItem={({ item }) => (
            <View>
              <TouchableOpacity
                style={styles.listItem}
                onPress={() => {
                  console.log(item);
                }}
              >
                <Text>{item}</Text>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={item => item.toString()}
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
            <Picker.Item label="Mandarin" value="mandarin" />
            <Picker.Item label="Malay" value="malay" />
            <Picker.Item label="Tamil" value="tamil" />
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
    borderWidth: 1,
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
    borderWidth: 1,
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
