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

import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

export async function getSearchCarpark(carpark_address) {
  let client = undefined;

  try {
    // Check if client has already been initialized once by the user
    if (!Stitch.hasAppClient(APP_ID)) {
      client = await Stitch.initializeDefaultAppClient(APP_ID);
    } else {
      client = await Stitch.getAppClient(APP_ID);
    }

    const db = await client
      .getServiceClient(RemoteMongoClient.factory, STITCH_SERVICE_NAME)
      .db(DB_NAME);

    const carParkCollection = db.collection(COLLECTION_NAME);

    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential());

    let result = await carParkCollection
      .find({ address: new RegExp(carpark_address.toUpperCase()) })
      .toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCurrentPosition() {
  const { status } = await Permissions.getAsync(Permissions.LOCATION);

  if (status !== "granted") {
    console.log("Permission is not granted!")
    // return;
  }

  let location = await Location.getCurrentPositionAsync({});

  return location;
}
