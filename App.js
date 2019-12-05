import React, { Component } from "react";
import { useScreens } from "react-native-screens";

import ScreenContainer from "./AppContainer";

useScreens();

const AppContainer = ScreenContainer;

/**
 * This class handles the routing and communication between classes
 *
 * @author
 */
export default class App extends Component {
  render() {
    return <AppContainer />;
  }
}
