import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  TopNavigationAction,
  useTheme
} from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "~/pages/Home";
import Profile from "~/pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { BottomSafeArea } from "./components/SafeArea";
import { useStoreState } from "easy-peasy";

const BottomTab = createBottomTabNavigator();
const Auth = createStackNavigator();
const Root = createStackNavigator();

const BottomTabBar = ({ navigation, state }) => {
  const onSelect = index => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <SafeAreaView>
      <BottomNavigation selectedIndex={state.index} onSelect={onSelect}>
        <BottomNavigationTab title="HOME" />
        <BottomNavigationTab title="PROFILE" />
      </BottomNavigation>
    </SafeAreaView>
  );
};

const AuthStack = () => {
  const theme = useTheme();
  return (
    <Auth.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"]
      }}
    >
      <Auth.Screen name="SignIn" component={SignIn}></Auth.Screen>
      <Auth.Screen name="SignUp" component={SignUp}></Auth.Screen>
    </Auth.Navigator>
  );
};

const TabNavigator = () => {
  const theme = useTheme();
  return (
    <>
      <BottomTab.Navigator tabBar={props => <BottomTabBar {...props} />}>
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen name="Profile" component={Profile} />
      </BottomTab.Navigator>
      <BottomSafeArea
        backgroundColor={theme["background-basic-color-1"]}
      ></BottomSafeArea>
    </>
  );
};

const Routes = () => {
  const theme = useTheme();
  const isAuthenticated = useStoreState(state => state.auth.signed);

  return (
    <NavigationContainer>
      <Root.Navigator headerMode="none">
        {!isAuthenticated ? (
          <Root.Screen name="Auth" component={AuthStack} />
        ) : (
          <Root.Screen headerMode="none" name="Main" component={TabNavigator} />
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
