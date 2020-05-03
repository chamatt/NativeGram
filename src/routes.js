import React from "react";
import { SafeAreaView, View } from "react-native";
import {
  NavigationContainer,
  useNavigation,
  CommonActions,
} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import {
  BottomNavigation,
  BottomNavigationTab,
  Icon,
  TopNavigationAction,
  useTheme,
  Button,
} from "@ui-kitten/components";
import {
  createStackNavigator,
  CardStyleInterpolators,
} from "@react-navigation/stack";
import { createSharedElementStackNavigator } from "react-navigation-shared-element";
import Home from "~/pages/Home";
import ProfileScreen from "~/pages/Profile";
import SignIn from "~/pages/SignIn";
import SignUp from "~/pages/SignUp";
import PostScreen from "~/pages/Post";
import CommentScreen from "~/pages/Comments";
import SettingsScreen from "~/pages/Settings";
import { BottomSafeArea } from "~/components/SafeArea";
import { useStoreState } from "easy-peasy";
import EditProfile from "./pages/EditProfile";
import EditProfileCamera from "~/pages/EditProfile/EditProfileCamera";
import EditProfileEditor from "~/pages/EditProfile/EditProfileEditor";

import CreatePostCamera from "~/pages/CreatePost/CreatePostCamera";
import CreatePostEditor from "~/pages/CreatePost/CreatePostEditor";
import CreatePostScreen from "~/pages/CreatePost/CreatePostScreen";
import FollowRoute from "./pages/FollowPage";
import SearchScreen from "./pages/Search";
import ExploreScreen from "./pages/Explore";

const BottomTab = createBottomTabNavigator();
const Auth = createStackNavigator();
const Root = createStackNavigator();
const Profile = createSharedElementStackNavigator();
const Post = createSharedElementStackNavigator();
const CreatePost = createSharedElementStackNavigator();
const Feed = createStackNavigator();
const Explore = createSharedElementStackNavigator();

const PersonIcon = (style) => <Icon {...style} name="person" />;
const HomeIcon = (style) => <Icon {...style} name="home" />;
const HeartIcon = (style) => <Icon {...style} name="heart-outline" />;
const SearchIcon = (style) => <Icon {...style} name="search-outline" />;
const CameraIcon = (style) => (
  <Icon {...style} style={{ width: 50 }} size={20} name="camera-outline" />
);

const BottomTabBar = ({ navigation, state }) => {
  const onSelect = (index) => {
    navigation.navigate(state.routeNames[index]);
  };

  const handleSecondPress = (index) => {
    console.log(index);
    if (navigation.canGoBack()) {
      if (state.index === index) navigation.popToTop();
    }
  };
  return (
    <SafeAreaView>
      <BottomNavigation
        selectedIndex={state.index}
        onSelect={onSelect}
        appearance="noIndicator"
      >
        <BottomNavigationTab
          icon={HomeIcon}
          onPressOut={() => handleSecondPress(0)}
        />
        <BottomNavigationTab
          icon={SearchIcon}
          onPressOut={() => handleSecondPress(1)}
        />
        <BottomNavigationTab
          icon={CameraIcon}
          onPressOut={() => handleSecondPress(2)}
        />
        <BottomNavigationTab
          icon={HeartIcon}
          onPressOut={() => handleSecondPress(3)}
        />
        <BottomNavigationTab
          icon={PersonIcon}
          onPressOut={() => handleSecondPress(4)}
        />
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
        initialRouteName="UserProfile"
      >
        <BottomTab.Screen name="FeedStack" component={FeedStack} />
        <BottomTab.Screen name="Explore" component={ExploreStack} />
        <BottomTab.Screen
          name="CreatePost"
          component={CreatePostStack}
          options={{ tabBarVisible: false }}
        />
        <BottomTab.Screen name="Notifications" component={ProfileStack} />
        <BottomTab.Screen name="UserProfile" component={ProfileStack} />
      </BottomTab.Navigator>
      <BottomSafeArea
        backgroundColor={theme["background-basic-color-1"]}
      ></BottomSafeArea>
    </>
  );
};

const ProfileScreens = (Navigator) => {
  const theme = useTheme();
  return (
    <>
      <Navigator.Screen
        name="Profile"
        component={ProfileScreen}
      ></Navigator.Screen>
      <Navigator.Screen
        name="EditProfile"
        options={{ title: "Edit Profile" }}
        component={EditProfile}
      ></Navigator.Screen>
      <Navigator.Screen
        options={{
          title: "",
        }}
        name="EditProfile/Camera"
        component={EditProfileCamera}
      ></Navigator.Screen>
      <Navigator.Screen
        options={{
          title: "Editor",
        }}
        name="EditProfile/Editor"
        component={EditProfileEditor}
      ></Navigator.Screen>
      <Navigator.Screen
        name="Follow"
        options={{
          title: "User Followers",
          headerStyle: {
            elevation: 0,
            shadowOpacity: 0,
          },
        }}
        component={FollowRoute}
      ></Navigator.Screen>
    </>
  );
};

const ExploreStack = () => {
  const theme = useTheme();
  const navigation = useNavigation();

  return (
    <Explore.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      <Explore.Screen
        options={{ headerShown: false }}
        name="Explore"
        component={ExploreScreen}
      />
      <Explore.Screen
        options={{ headerShown: false }}
        name="Search"
        component={SearchScreen}
      />
      {ProfileScreens(Explore)}
      {PostScreens(Explore)}
    </Explore.Navigator>
  );
};

const ProfileStack = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Profile.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        mode: "card",

        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      {ProfileScreens(Profile)}
      {PostScreens(Profile)}
    </Profile.Navigator>
  );
};

const FeedStack = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  return (
    <Feed.Navigator
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        mode: "card",
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
      }}
    >
      <Feed.Screen name="Feed" component={Home}></Feed.Screen>
      {ProfileScreens(Feed)}
      {PostScreens(Feed)}
    </Feed.Navigator>
  );
};

const PostScreens = (Navigator) => {
  const theme = useTheme();

  return (
    <>
      <Navigator.Screen
        name="Post"
        sharedElementsConfig={(route, otherRoute, showing) => {
          const { postId } = route.params;
          if (otherRoute.name === "Profile" && showing)
            return [
              {
                id: `post.${postId}.photo`,
                // animation: "fade",
              },
            ];
        }}
        component={PostScreen}
      ></Navigator.Screen>
      <Navigator.Screen
        name="Comments"
        component={CommentScreen}
      ></Navigator.Screen>
    </>
  );
};

const CreatePostStack = () => {
  const theme = useTheme();
  return (
    <CreatePost.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: theme["background-basic-color-1"] },
        headerTintColor: theme["text-basic-color"],
        // cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        // mode: "card",
      }}
    >
      <CreatePost.Screen
        options={{
          title: "",
        }}
        name="CreatePost/Camera"
        component={CreatePostCamera}
      ></CreatePost.Screen>
      <CreatePost.Screen
        options={{
          title: "Editor",
        }}
        name="CreatePost/Editor"
        component={CreatePostEditor}
        sharedElementsConfig={(route, otherRoute, showing) => {
          const { image } = route.params;
          // if (
          //   (otherRoute.name === "CreatePost/Save" ||
          //     otherRoute.name === "CreatePost/Camera") &&
          //   showing
          // )
          return [
            {
              id: `createPost.${image.uri}.photo`,
              // animation: "fade",
            },
          ];
        }}
      ></CreatePost.Screen>
      <CreatePost.Screen
        options={{
          title: "Post",
        }}
        name="CreatePost/Save"
        component={CreatePostScreen}
      ></CreatePost.Screen>
    </CreatePost.Navigator>
  );
};

const Routes = () => {
  const theme = useTheme();
  const isAuthenticated = useStoreState((state) => state.auth.signed);

  return (
    <NavigationContainer
      screenOptions={{
        cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
        mode: "card",
      }}
    >
      <Root.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: theme["background-basic-color-1"] },
          headerTintColor: theme["text-basic-color"],
        }}
      >
        {!isAuthenticated ? (
          <Root.Screen
            name="Auth"
            options={{ headerShown: false }}
            component={AuthStack}
          />
        ) : (
          <>
            <Root.Screen
              headerMode="none"
              options={{ headerShown: false }}
              name="Main"
              component={TabNavigator}
            />
            <Root.Screen name="Settings" component={SettingsScreen} />
          </>
        )}
      </Root.Navigator>
    </NavigationContainer>
  );
};

export default Routes;
