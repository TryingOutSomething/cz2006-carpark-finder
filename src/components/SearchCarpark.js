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

import {
  getSearchCarpark,
  getCarparksAvailability
} from "../controllers/CarParkDataHandler";

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

    this.getSearchCarpark = getSearchCarpark.bind(this);
    this.carparkAvail = getCarparksAvailability.bind(this);
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
    let carparkLots = [];
    carparkLots.push(carpark);

    this.carparkAvail()
      .then(cpLots => {
        let lotInfo = cpLots.find(
          lot => carparkLots[0].car_park_no === lot.carpark_number
        );

        if (lotInfo.carpark_info.length > 1) {
          let cTypeLot = lotInfo.carpark_info.find(lotType => lotType === "C");

          carparkLots[0]["lots_available"] = cTypeLot.lots_available;
          carparkLots[0]["total_lots"] = cTypeLot.total_lots;
        } else {
          carparkLots[0]["lots_available"] =
            lotInfo.carpark_info[0].lots_available;
          carparkLots[0]["total_lots"] = lotInfo.carpark_info[0].total_lots;
        }

        this.props.navigation.navigate("home", {
          selectedCarpark: carparkLots
        });
      })
      .catch(err => console.log(err));
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
              animated={true}
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
                    ListEmptyComponent={
                      <Text style={styles.FetchingData}>No Results!</Text>
                    }
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
