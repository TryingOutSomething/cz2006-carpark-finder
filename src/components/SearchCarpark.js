import React, { Component } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  ScrollView,
  View
} from "react-native";

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
  }

  renderCarParkList(carpark_address) {
    this.setState({ isFetching: true });

    this.getSearchCarpark(carpark_address).then(value =>
      this.setState({ carParkInfo: value })
    );
  }

  render() {
    return (
      <View style={styles.container}>
        <TextInput
          style={styles.textarea}
          onChangeText={text => this.setState({ textInput: text })}
          value={this.state.textInput}
          placeholder="Enter Carpark"
        />
        <Button
          onPress={() => this.renderCarParkList(this.state.textInput)}
          title="Search"
        />

        {this.state.isFetching ? (
          this.state.carParkInfo ? (
            <ScrollView>
              <FlatList
                data={this.state.carParkInfo}
                renderItem={({ item }) => <Text>{item.address}</Text>}
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
  textarea: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1
  }
});
