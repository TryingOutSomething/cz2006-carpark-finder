import React, { Component } from "react";
import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

import DisplayMap from "./components/DisplayMap";
import FindCarparks from "./components/FindCarparks";

const AppStackNavigator = createStackNavigator(
  {
    home: { screen: DisplayMap },
    search: { screen: FindCarparks }
  },
  { initialRoute: "home" }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
