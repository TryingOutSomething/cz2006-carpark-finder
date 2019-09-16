import React, { Component } from "react";
import { Text, View } from "react-native";
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
  constructor() {
    super();
    this.state = {
      address: undefined,
      parkingType: undefined,
      carParkNo: undefined,
      isFetching: true
    };

    this._loadClient = this._loadClient.bind(this);
  }

  componentWillMount() {
    this._loadClient();
  }

  _loadClient() {
    // TODO: Move credentials to dotenv
    Stitch.initializeDefaultAppClient(APP_ID)
      .then(client => {
        const dbClient = client.getServiceClient(
          RemoteMongoClient.factory,
          STITCH_SERVICE_NAME
        );
        client.auth
          .loginWithCredential(new AnonymousCredential())
          .then(user => {
            const carParkCollection = dbClient
              .db(DB_NAME)
              .collection(COLLECTION_NAME);

            carParkCollection
              .find({ car_park_no: "AK19" })
              .toArray()
              .then(result => {
                this.setState({
                  address: result[0].address,
                  parkingType: result[0].parking_system_type,
                  carParkNo: result[0].car_park_no,
                  isFetching: false
                });
              });
          })
          .catch(err => console.log(err));
      })
      .catch(err => console.log(err));
  }

  render() {
    /**
     * Check if data is being fetched from the server.
     * If the app is still fetching the data,
     * the app will display loading screen to the user.
     */

    if (!this.state.isFetching) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Car Park Number: {this.state.carParkNo}</Text>
          <Text>Address: {this.state.address}</Text>
          <Text>Parking Type: {this.state.parkingType}</Text>
        </View>
      );
    } else {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text>Fetching data...</Text>
        </View>
      );
    }
  }
}
