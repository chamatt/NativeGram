import React from "react";
import { SafeAreaView } from "~/components/SafeArea";
import {
  Drawer,
  DrawerHeaderFooter,
  Icon,
  Avatar,
  Text,
  Layout,
} from "@ui-kitten/components";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useNavigation } from "@react-navigation/native";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useEvaTheme } from "~/context/ThemeContext";
import client from "~/graphql";

const PersonIcon = (style) => <Icon {...style} name="person" />;
const ExitIcon = (style) => <Icon {...style} name="log-out" />;

const FETCH_USER = gql`
  query fetchUser($id: ID!) {
    user(id: $id) {
      id
      username
      email
    }
  }
`;

const Header = ({ onPress, data }) => {
  return (
    <DrawerHeaderFooter
      title={data?.user?.username}
      description={data?.user?.email}
      icon={PersonIcon}
      onPress={onPress}
      style={{ paddingBottom: 20 }}
    />
  );
};

const Settings = () => {
  const signOut = useStoreActions((actions) => actions.auth.signOut);
  const navigation = useNavigation();
  const me = useStoreState((state) => state?.auth?.user?._id);
  const { data, loading, error, refetch } = useQuery(FETCH_USER, {
    variables: { id: me },
  });
  const { themeType, toggleThemeType } = useEvaTheme();

  const drawerData = [
    {
      title: "Change Theme",
      onPress: async () => {
        toggleThemeType();
        client.clearStore();
      },
      icon: (style) => (
        <Icon
          {...style}
          name={themeType === "light" ? "sun-outline" : "moon"}
        />
      ),
    },
    {
      title: "Logout",
      icon: ExitIcon,
    },
  ];

  const onRouteSelect = async (index) => {
    const route = drawerData[index];

    if (route.onPress) {
      route.onPress();
    }
    if (route.title === "Logout") {
      await client.clearStore();
      signOut();
    }

    // navigate with React Navigation
    // navigation.navigate(route.title);
  };

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <Drawer
          data={drawerData}
          header={() => (
            <Header
              data={data}
              onPress={() => navigation.navigate("Profile")}
            />
          )}
          onSelect={onRouteSelect}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Settings;
