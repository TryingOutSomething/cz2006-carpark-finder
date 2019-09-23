import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import DisplayMap from "./src/components/DisplayMap";
import FindCarparks from "./src/components/SearchCarpark";
import Settings from "./src/components/Settings";

const AppStackNavigator = createStackNavigator(
  {
    home: { screen: DisplayMap },
    search: { screen: FindCarparks },
    settings: { screen: Settings }
  },
  { initialRoute: "home" }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
