import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { BottomNavigation, BottomNavigationTab } from "@ui-kitten/components";
import Home from "~/pages/Home";
import Profile from "~/pages/Profile";

const BottomTab = createBottomTabNavigator();

const BottomTabBar = ({ navigation, state }) => {
  const onSelect = index => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
        <BottomNavigationTab title="USERS" />
        <BottomNavigationTab title="ORDERS" />
      </BottomNavigation>
    </SafeAreaView>
  );
};

const TabNavigator = () => (
  <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
    <BottomTab.Screen name="Home" component={Home} />
    <BottomTab.Screen name="Profile" component={Profile} />
  </BottomTab.Navigator>
);

const Routes = () => (
  <NavigationContainer>
    <TabNavigator />
  </NavigationContainer>
);

export default Routes;
