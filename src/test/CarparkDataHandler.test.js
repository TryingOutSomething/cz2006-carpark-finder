import {
  singleValidCarparkData,
  singleInvalidCarparkData,
  carparkDataList
} from "./TestingVariables";

const carparkDataHandler = require("../controllers/CarParkDataHandler");

/**
 * Control class testing
 */

test("Get list of lot availability from Govtech API", () => {
  return carparkDataHandler.getLotAvailability().then(results => {
    expect(results.length).toBeGreaterThan(0);
  });
});

/**
 * Unit testing for a single carpark lot data
 */
test("Combine lot availability and valid carpark data", () => {
  const testingVariable = singleValidCarparkData;

  return carparkDataHandler.getLotAvailability().then(lotAvailability => {
    const result = carparkDataHandler.combineCarparkData(
      lotAvailability,
      testingVariable
    );

    expect(result[0].hasOwnProperty("total_lots")).toBeTruthy();
    expect(result[0].hasOwnProperty("lots_available")).toBeTruthy();
    expect(typeof result[0].total_lots).toEqual("string");
    expect(typeof result[0].lots_available).toEqual("string");
  });
});

test("Combine lot availability and invalid carpark data", () => {
  const testingVariable = singleInvalidCarparkData;

  return carparkDataHandler.getLotAvailability().then(lotAvailability => {
    const result = carparkDataHandler.combineCarparkData(
      lotAvailability,
      testingVariable
    );

    expect(result.hasOwnProperty("total_lots")).toBeFalsy();
    expect(result.hasOwnProperty("lots_available")).toBeFalsy();
  });
});

/**
 * Unit testing for a list of carpark lot data
 */
test("Combine lot availability and valid carpark data from a list of carpark lots", () => {
  const testingVariable = carparkDataList;

  return carparkDataHandler.getLotAvailability().then(lotAvailability => {
    const result = carparkDataHandler.combineCarparkData(
      lotAvailability,
      testingVariable
    );

    for (let i = 0; i < result.length; i++) {
      expect(result[i].hasOwnProperty("total_lots")).toBeTruthy();
      expect(result[i].hasOwnProperty("lots_available")).toBeTruthy();
      expect(typeof result[i].total_lots).toEqual("string");
      expect(typeof result[i].lots_available).toEqual("string");
    }
  });
});
