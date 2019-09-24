import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View
} from "react-native";

import { IconButton, TextInput } from "react-native-paper";

import SearchCarpark from "../controllers/CarParkDataHandler";

export default class FindCarparks extends Component {
  static navigationOptions = {
    headerTitle: "Search Carparks"
  };

  constructor() {
    super();
    this.state = {
      carParkInfo: undefined,
      isFetching: false
    };

    this.getSearchCarpark = SearchCarpark.bind(this);
    this.renderCarParkList = this.renderCarParkList.bind(this);
    this.routeToMap = this.routeToMap.bind(this);
  }

  renderCarParkList(carpark_address) {
    if (!carpark_address) return;
    this.setState({ isFetching: true });

    this.getSearchCarpark(carpark_address).then(value => {
      this.setState({ carParkInfo: value });
    });
  }

  routeToMap(carpark) {
    this.props.navigation.navigate("home", {
      selectedCarpark: carpark
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
              underlineColor="purple"
            />
            <IconButton
              style={styles.Button}
              onPress={() => this.renderCarParkList(this.state.textInput)}
              icon="search"
            />
          </View>
          <View style={styles.List}>
            {this.state.isFetching ? (
              this.state.carParkInfo ? (
                <ScrollView>
                  <FlatList
                    data={this.state.carParkInfo}
                    renderItem={({ item }) => (
                      <View>
                        <TouchableOpacity
                          style={styles.ListItem}
                          onPress={() => {
                            this.routeToMap(item);
                          }}
                        >
                          <Text>{item.address}</Text>
                        </TouchableOpacity>
                      </View>
                    )}
                    keyExtractor={item => item._id.toString()}
                    ListEmptyComponent={<Text>No Results!</Text>}
                  />
                </ScrollView>
              ) : (
                <Text style={styles.FetchingData}>Fetching Data</Text>
              )
            ) : null}
          </View>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "column"
  },

  searchWithText: {
    flex: 1,
    flexDirection: "row"
  },

  FetchingData: {
    marginTop: "10%",
    marginLeft: "3%"
  },

  List: {
    marginTop: "12%",
    height: "100%"
  },

  Button: {
    marginTop: "3%"
  },
  TextArea: {
    height: 40,
    width: "87%",
    marginLeft: "3%",
    marginTop: "3%"
  },
  ListItem: {
    padding: 20,
    marginHorizontal: 16
  }
});
