import React, { Component } from "react";
import {
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View
} from "react-native";
import {
  Stitch,
  RemoteMongoClient,
  AnonymousCredential
} from "mongodb-stitch-react-native-sdk";

import {
  APP_ID,
  STITCH_SERVICE_NAME,
  DB_NAME,
  COLLECTION_NAME
} from "react-native-dotenv";

export default class FindCarparks extends Component {
  static navigationOptions = {
    headerTitle: "Search Carparks"
  };

  constructor() {
    super();
    this.state = {
      carParkInfo: undefined,
      isFetching: true
    };

    this._loadClient = this._loadClient.bind(this);
  }

  async _loadClient(text) {
    let client = undefined;

    try {
      if (!Stitch.hasAppClient(APP_ID)) {
        client = await Stitch.initializeDefaultAppClient(APP_ID);
      } else {
        client = await Stitch.getAppClient(APP_ID);
      }

      const db = await client
        .getServiceClient(RemoteMongoClient.factory, STITCH_SERVICE_NAME)
        .db(DB_NAME);

      const carParkCollection = db.collection(COLLECTION_NAME);

      Stitch.defaultAppClient.auth.loginWithCredential(
        new AnonymousCredential()
      );

      carParkCollection
        .find({ address: new RegExp(text.toUpperCase()) })
        .toArray()
        .then(result => {
          this.setState({
            carParkInfo: result
          });
        });
    } catch (err) {
      console.log(err);
    }
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
          onPress={() => this._loadClient(this.state.textInput)}
          title="log output"
        />
        {this.state.carParkInfo
          ? this.state.carParkInfo.map(value => {
              return (
                <Text key={value._id}>
                  {value.address} {"\n"}
                  {value.car_park_no} {"\n"}
                  {value.latitude} {"\n"}
                  {value.longitude} {"\n"}
                  {value.parking_system_type} {"\n"}
                </Text>
              );
            })
          : null}
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
