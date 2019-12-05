import DisplayMap from "./src/screens/DisplayMap";
import SearchCarparks from "./src/screens/SearchCarpark";
import Settings from "./src/screens/Settings";
import DenyLocation from "./src/screens/DenyLocation";

import { createAppContainer } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";

const AppStackNavigator = createStackNavigator(
  {
    home: { screen: DisplayMap },
    search: { screen: SearchCarparks },
    settings: { screen: Settings },
    denyLocation: { screen: DenyLocation }
  },
  { initialRouteName: "search" }
);

const AppContainer = createAppContainer(AppStackNavigator);

export default AppContainer;
