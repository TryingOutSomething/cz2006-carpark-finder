import { StyleSheet } from "react-native";

export default styles = StyleSheet.create({
  container: {
    flex: 1
  },

  routingContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: "5%"
  },
  map: {
    ...StyleSheet.absoluteFillObject
  },

  buttonContainer: {
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end"
  },

  nearestCpButton: {
    width: "80%",
    marginBottom: "10%",
    backgroundColor: "#01579B"
  },

  contentContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "space-around"
  },

  textHeader: {
    textAlign: "center",
    fontSize: 20
  },

  textBody: {
    textAlign: "center",
    fontSize: 17
  },

  drawerToolbarOptions: {
    flexDirection: "row",
    justifyContent: "space-between"
  },

  drawerAnotherButton: {
    marginRight: "2%",
    width: 150
  },

  drawerOkButton: {
    marginLeft: "2%",
    width: 150
  }
});
