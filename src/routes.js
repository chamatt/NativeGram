import React from "react";
import { SafeAreaView } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  TopNavigationAction,
  useTheme,
  Button,
} from "@ui-kitten/components";
import { createStackNavigator } from "@react-navigation/stack";
import Home from "~/pages/Home";
import ProfileScreen from "~/pages/Profile";
import SignIn from "./pages/SignIn";
import SignUp from "./pages/SignUp";
import { BottomSafeArea } from "./components/SafeArea";
import { useStoreState } from "easy-peasy";

const BottomTab = createBottomTabNavigator();
const Auth = createStackNavigator();
const Root = createStackNavigator();
const Profile = createStackNavigator();

const PersonIcon = (style) => <Icon {...style} name="person" />;
const HomeIcon = (style) => <Icon {...style} name="home" />;
const CameraIcon = (style) => (
  <Icon {...style} style={{ width: 50 }} size={20} name="camera-outline" />
);
const SettingsIcon = (style) => <Icon {...style} name="settings" />;

const BottomTabBar = ({ navigation, state }) => {
  const onSelect = (index) => {
    navigation.navigate(state.routeNames[index]);
  };

  return (
    <SafeAreaView>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={onSelect}
        appearance="noIndicator"
      >
        <BottomNavigationTab icon={HomeIcon} />
        <BottomNavigationTab
          icon={(style) => (
            <Button
              disabled
              {...style}
              style={{ pointerEvents: "none" }}
              icon={CameraIcon}
            ></Button>
          )}
        />
        <BottomNavigationTab icon={PersonIcon} />
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
        headerTintColor: theme["text-basic-color"],
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
      <BottomTab.Navigator
        tabBar={(props) => <BottomTabBar {...props} />}
        initialRouteName="Profile"
      >
        <BottomTab.Screen name="Home" component={Home} />
        <BottomTab.Screen name="Camera" component={ProfileStack} />
        <BottomTab.Screen name="Profile" component={ProfileStack} />
      </BottomTab.Navigator>
      <BottomSafeArea
        backgroundColor={theme["background-basic-color-1"]}
      ></BottomSafeArea>
    </>
  );
};

const ProfileStack = () => {
  const theme = useTheme();
  return (
    <Profile.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      <Profile.Screen
        options={{
          headerRight: () => (
            <Button
              appearance="ghost"
              status="basic"
              onPress={() => alert("This is a button!")}
              icon={SettingsIcon}
            ></Button>
          ),
        }}
        name="Profile"
        component={ProfileScreen}
      ></Profile.Screen>
    </Profile.Navigator>
  );
};

const Routes = () => {
  // const theme = useTheme();
  const isAuthenticated = useStoreState((state) => state.auth.signed);

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
