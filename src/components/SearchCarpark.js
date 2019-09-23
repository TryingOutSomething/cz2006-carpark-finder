import React, { Component } from "react";
import {
  FlatList,
  StyleSheet,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

import { Button } from "react-native-paper";

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
    this.log = this.log.bind(this);
  }

  renderCarParkList(carpark_address) {
    if (!carpark_address) return;
    this.setState({ isFetching: true });

    this.getSearchCarpark(carpark_address).then(value => {
      this.setState({ carParkInfo: value });
    });
  }

  log(item) {
    console.log(item);
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.TextArea}
          onChangeText={text => this.setState({ textInput: text })}
          value={this.state.textInput}
          placeholder="Enter Carpark"
        />
        <Button
          onPress={() => this.renderCarParkList(this.state.textInput)}
          mode="contained"
          children="Search"
        />

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
                        this.log(item);
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
            <Text>Fetching Data</Text>
          )
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  TextArea: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  },
  ListItem: {
    backgroundColor: "#f9c2ff",
    padding: 20,
    marginVertical: 8,
    marginHorizontal: 16
  }
});
