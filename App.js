import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import DisplayMap from "./src/components/DisplayMap";
import SearchCarparks from "./src/components/SearchCarpark";
import Settings from "./src/components/Settings";
import test from "./src/components/test";

const AppStackNavigator = createStackNavigator(
  {
    home: { screen: DisplayMap },
    search: { screen: SearchCarparks },
    settings: { screen: Settings },
    test: { screen: test }
  },
  { initialRoute: "home" }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
