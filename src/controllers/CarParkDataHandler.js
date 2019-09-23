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

export default getSearchCarpark = async function(carpark_address) {
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
};
