import * as Permissions from "expo-permissions";
import * as Location from "expo-location";

/**
 * This function is used to get user's current location. The app will
 * ask for user's permission first before getting their location
 * 
 * @author Jarrold Tan
 */
export async function getCurrentLocation() {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);

    if (status !== "granted") return;

    let location = await Location.getCurrentPositionAsync({});

    return location;
}