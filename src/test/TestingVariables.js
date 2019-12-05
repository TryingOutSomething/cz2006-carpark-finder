// Valid carpark data
export const singleValidCarparkData = [
  {
    car_park_no: "JMB1",
    address: "BLK 117A JALAN MEMBINA",
    parking_system_type: "ELECTRONIC PARKING",
    car_park_type: "MULTI-STOREY CAR PARK",
    loc: { type: "Point", coordinates: [103.827018, 1.281935] }
  }
];

// Invalid carpark data
export const singleInvalidCarparkData = [
  {
    car_park_no: "12345",
    address: "BLK 117A JALAN MEMBINA",
    parking_system_type: "ELECTRONIC PARKING",
    car_park_type: "MULTI-STOREY CAR PARK",
    loc: { type: "Point", coordinates: [103.827018, 1.281935] }
  }
];

// List of carpark data with one invalid entry
export const carparkDataList = [
  {
    car_park_no: "JMB1",
    address: "BLK 117A JALAN MEMBINA",
    parking_system_type: "ELECTRONIC PARKING",
    car_park_type: "MULTI-STOREY CAR PARK",
    loc: { type: "Point", coordinates: [103.827018, 1.281935] }
  },

  {
    car_park_no: "12345",
    address: "BLK 117A JALAN MEMBINA",
    parking_system_type: "ELECTRONIC PARKING",
    car_park_type: "MULTI-STOREY CAR PARK",
    loc: { type: "Point", coordinates: [103.827018, 1.281935] }
  }
];

export const carparkForComponentTesting = {
  car_park_no: "JMB1",
  address: "BLK 117A JALAN MEMBINA",
  parking_system_type: "ELECTRONIC PARKING",
  car_park_type: "MULTI-STOREY CAR PARK",
  loc: { type: "Point", coordinates: [103.827018, 1.281935] },
  total_lots: "100",
  lots_available: "50"
};
