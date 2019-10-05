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
        <ScrollView>
          <FlatList
            data={this.props.navigation.getParam("bookmarkList", null)}
            renderItem={({ item }) => (
              <View>
                <TouchableOpacity
                  style={styles.ListItem}
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
              <Text style={styles.FetchingData}>No Results!</Text>
            }
          />

          <Text>Other Settings:</Text>
          <View>
            <Text>Language</Text>
            <Picker
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
          <View>
            <Text>Contact us @ testytest.com</Text>
            <Text>Software Engineering group SSP3 testytest</Text>
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },

  FetchingData: {
    marginTop: "10%",
    marginLeft: "3%"
  }
});
