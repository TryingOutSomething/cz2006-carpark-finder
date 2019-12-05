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

/**
 * This "class" interacts with the database and Real-Time carpark data
 * from Govtech API
 *
 * @author Thung Jia Cheng
 */

async function connectToDb() {
  let client = undefined;

  try {
    if (!Stitch.hasAppClient(APP_ID)) {
      client = await Stitch.initializeDefaultAppClient(APP_ID);
    } else {
      client = await Stitch.getAppClient(APP_ID);
    }

    Stitch.defaultAppClient.auth.loginWithCredential(new AnonymousCredential());

    const collection = await client
      .getServiceClient(RemoteMongoClient.factory, STITCH_SERVICE_NAME)
      .db(DB_NAME)
      .collection(COLLECTION_NAME);

    return collection;
  } catch (e) {
    console.log(e);
  }
}

/**
 * This function queries the database base on user's
 * input and returns an Object of car park info
 *
 * @author Thung Jia Cheng
 */
export async function getSearchCarpark(carparkAddress) {
  try {
    const carParkCollection = await connectToDb();

    let result = await carParkCollection
      .find({ address: new RegExp(carparkAddress.toUpperCase()) })
      .toArray();
    return result;
  } catch (err) {
    console.log(err);
  }
}

/**
 * This function gets the total number of lots and lot availability
 * from the Govtech API, the nearest carparks from the user
 * and combines them together.
 *
 * @param {float} long - user's longitude coordinates
 * @param {float} lat - user's latitude coordinates
 *
 * @author Thung Jia Cheng
 */
export async function getNearbyCarparks(long, lat) {
  let carparkLotAvailability = await getLotAvailability();

  let nearbyCarparks = await getNearbyCarparkInfo(long, lat);

  // We will only take up to 15 lots that are nearest to the user
  let truncatedLots = undefined;

  if (nearbyCarparks.length > 15) truncatedLots = nearbyCarparks.slice(0, 15);
  else truncatedLots = nearbyCarparks;

  // Combine total number of lots and lot availbility into car park list
  let result = combineCarparkData(carparkLotAvailability, truncatedLots);

  return result;
}

/**
 * This parent function gets the number of available lots and total number of
 * lots. It then combines with each carpark info in the list of carparks
 *
 * @param {Object[]} carparkLot
 *
 * @author Thung Jia Cheng
 */
export async function updateCarparkWithLotAvailability(carparkLot) {
  let carparkLotAvailability = await getLotAvailability();

  // Combine total number of lots and lot availbility into car park list
  return combineCarparkData(carparkLotAvailability, carparkLot);
}

export async function getLotAvailability() {
  let response = await axios
    .get("https://api.data.gov.sg/v1/transport/carpark-availability")
    .catch(err => console.log(err));

  return response.data.items[0].carpark_data;
}

/**
 * This function gets the nearest carparks within a range of 5km radius
 * from the user
 *
 * @param {float} long
 * @param {float} lat
 *
 * @author Thung Jia Cheng
 */
export async function getNearbyCarparkInfo(long, lat) {
  try {
    const carParkCollection = await connectToDb();

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

/**
 * This function is used to combine the lot availability and total lot info
 * the respective carparks in the carpark list
 *
 * @param {Object[]} lotAvailability
 * @param {Object[]} carparks
 *
 * @author Thung Jia Cheng
 */
export function combineCarparkData(lotAvailability, carparks) {
  let carparkListWithTotalCurrentLots = addTotalCurrentLotAvailability(
    lotAvailability,
    carparks
  );
  /**
   * Remove car park lots that do not have total number of lots and
   * lot availability information
   */
  let updatedCarparkList = removeInvalidCarparks(
    carparkListWithTotalCurrentLots
  );
  
  return updatedCarparkList;
}

function addTotalCurrentLotAvailability(lotAvailability, carparks) {
  for (let i = 0; i < carparks.length; i++) {
    for (let j = 0; j < lotAvailability.length; j++) {
      if (carparks[i].car_park_no !== lotAvailability[j].carpark_number)
        continue;

      if (
        carparks[i].car_park_no === lotAvailability[j].carpark_number &&
        lotAvailability[j].carpark_info.length > 1
      ) {
        // We consider "C" type as we are currently targeting car owners only
        let cTypeLot = lotAvailability[i].carpark_info.find(
          lot => lot.lot_type === "C"
        );

        carparks[i].car_park_no["lots_available"] = cTypeLot.lots_available;
        carparks[i].car_park_no["total_lots"] = cTypeLot.total_lots;
      } else {
        carparks[i]["lots_available"] =
          lotAvailability[j].carpark_info[0].lots_available;

        carparks[i]["total_lots"] =
          lotAvailability[j].carpark_info[0].total_lots;
      }
    }
  }

  return lotAvailability;
}

function removeInvalidCarparks(carparkList) {
  return carparkList.filter(lotInfo => lotInfo.hasOwnProperty("total_lots"));
}
