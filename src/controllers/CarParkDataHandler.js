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

import axios from "axios";

export async function getSearchCarpark(carpark_address) {
  let client = undefined;

  try {
    // Check if client has already been initialized once by the user
    if (!Stitch.hasAppClient(APP_ID)) {
      client = await Stitch.initializeDefaultAppClient(APP_ID);
    } else {
      client = await Stitch.getAppClient(APP_ID);
    }

    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential());

    const db = await client
      .getServiceClient(RemoteMongoClient.factory, STITCH_SERVICE_NAME)
      .db(DB_NAME);

    const carParkCollection = db.collection(COLLECTION_NAME);

    let result = await carParkCollection
      .find({ address: new RegExp(carpark_address.toUpperCase()) })
      .toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

export async function getCarparksAvailability() {
  let response = await axios
    .get("https://api.data.gov.sg/v1/transport/carpark-availability")
    .catch(err => console.log(err));

  return response.data.items[0].carpark_data;
}

export async function getCarparkInfo(long, lat) {
  let client = undefined;

  try {
    // Check if client has already been initialized once by the user
    if (!Stitch.hasAppClient(APP_ID)) {
      client = await Stitch.initializeDefaultAppClient(APP_ID);
    } else {
      client = await Stitch.getAppClient(APP_ID);
    }

    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential());

    const db = await client
      .getServiceClient(RemoteMongoClient.factory, STITCH_SERVICE_NAME)
      .db(DB_NAME);

    const carParkCollection = db.collection(COLLECTION_NAME);

    let result = await carParkCollection
      .find({
        loc: {
          $near: {
            $geometry: { type: "Point", coordinates: [long, lat] },
            $maxDistance: 5000
          }
        }
      })
      .toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

export function mergeCarparkData(lots, first15Lots) {
  /** Filtering the available carpark lots fetched from the
   *  carpark_availability API against the first 15 car park lots
   *  that are the nearerst from our location.
   */
  let filteredLots = lots.filter(lotInfo =>
    first15Lots.find(
      carparkInfo => lotInfo.carpark_number === carparkInfo.car_park_no
    )
  );

  for (let i = 0; i < filteredLots.length; i++) {
    for (let j = 0; j < first15Lots.length; j++) {
      if (filteredLots[i].carpark_number !== first15Lots[j].car_park_no)
        continue;
      else if (
        /** If there is only one lot_type in the filteredLots array element,
         *  we add it into the current element in the first15Lots
         */
        filteredLots[i].carpark_number === first15Lots[j].car_park_no &&
        filteredLots[i].carpark_info.length === 1
      ) {
        first15Lots[j]["lots_available"] =
          filteredLots[i].carpark_info[0].lots_available;

        first15Lots[j]["total_lots"] =
          filteredLots[i].carpark_info[0].total_lots;
      } else {
        /** If there are more than one lot_type, we will only focus on lot_type C
         *  as it has the most number of lots in the element
         */
        let cTypeLot = filteredLots[i].carpark_info.find(
          lot => lot.lot_type === "C"
        );

        first15Lots[j]["lots_available"] = cTypeLot.lots_available;

        first15Lots[j]["total_lots"] = cTypeLot.total_lots;
      }
    }
  }

  // Lastly, we remove carpark lots that cannot be found in the HDB Carpark Database
  let removedLots = first15Lots.filter(lotInfo =>
    lotInfo.hasOwnProperty("total_lots")
  );

  return removedLots;
}
