import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import { useScreens } from "react-native-screens";

import DisplayMap from "./src/screens/DisplayMap";
import SearchCarparks from "./src/screens/SearchCarpark";
import Settings from "./src/screens/Settings";
import DenyLocation from "./src/screens/DenyLocation";

useScreens();

const AppStackNavigator = createStackNavigator(
  {
    home: { screen: DisplayMap },
    search: { screen: SearchCarparks },
    settings: { screen: Settings },
    denyLocation: { screen: DenyLocation }
  },
  { initialRouteName: "denyLocation" }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
