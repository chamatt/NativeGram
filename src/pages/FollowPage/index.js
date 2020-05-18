import React, { useState, useEffect } from "react";
import FollowList from "~/components/FollowList";
import PropTypes from "prop-types";
import { gql } from "apollo-boost";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useRoute } from "@react-navigation/native";
import { useStoreState } from "easy-peasy";
import { useQuery } from "@apollo/react-hooks";
import { useTheme, Layout } from "@ui-kitten/components";
import EmptyList from "~/components/EmptyList";
import { View } from "react-native";

const Tab = createMaterialTopTabNavigator();

// import { Container } from './styles';

const FETCH_FOLLOWERS = gql`
  query fetchProfile($id: ID!) {
    user(id: $id) {
      id
      followers {
        id
        follower {
          id
          username
          profile {
            id
            name
            avatar {
              id
              url
            }
          }
        }
      }
    }
  }
`;

const FETCH_FOLLOWINGS = gql`
  query fetchProfile($id: ID!) {
    user(id: $id) {
      id
      followings {
        id
        following {
          id
          username
          profile {
            id
            name
            avatar {
              id
              url
            }
          }
        }
      }
    }
  }
`;

const useFollow = (QUERY, userId) => {
  const { data, loading, error } = useQuery(QUERY, {
    variables: {
      id: userId,
    },
  });

  return {
    data,
    loading,
    error,
  };
};

const transformDataIntoUsers = (list, path) => {
  return list?.map((it) => {
    const item = it?.[path];
    const imageUri = item?.profile?.avatar?.url
      ? { uri: item?.profile?.avatar?.url }
      : null;

    return {
      id: item?.id,
      slug: item?.username,
      name: item?.profile?.name,
      image: imageUri,
    };
  });
};

const Followers = () => {
  const route = useRoute();
  const me = useStoreState((state) => state?.auth?.user?._id);
  const userId = route?.params?.userId;
  const { data, loading, error, refetch } = useFollow(
    FETCH_FOLLOWERS,
    userId || me
  );

  const [users, setUsers] = useState([]);
  useEffect(() => {
    console.log(data?.user);
    if (data?.user?.followers) {
      setUsers(transformDataIntoUsers(data?.user?.followers, "follower"));
    }
  }, [data]);

  return (
    <FollowList
      users={users}
      refreshing={loading}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={{ height: 200 }}>
          <EmptyList text="No followers" />
        </View>
      }
    />
  );
};

const Following = () => {
  const route = useRoute();
  const me = useStoreState((state) => state?.auth?.user?._id);
  const userId = route?.params?.userId;
  const { data, loading, error, refetch } = useFollow(
    FETCH_FOLLOWINGS,
    userId || me
  );

  const [users, setUsers] = useState([]);
  useEffect(() => {
    if (data?.user?.followings) {
      setUsers(transformDataIntoUsers(data?.user?.followings, "following"));
    }
  }, [data]);

  return (
    <FollowList
      users={users}
      refreshing={loading}
      onRefresh={refetch}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={
        <View style={{ height: 200 }}>
          <EmptyList text="Not following anyone" />
        </View>
      }
    />
  );
};

export default function FollowRoute({ route }) {
  const theme = useTheme();
  return (
    <Tab.Navigator
      tabBarOptions={{
        style: { backgroundColor: theme["background-basic-color-1"] },
        activeTintColor: theme["text-basic-color"],
        inactiveTintColor: theme["text-hint-color"],
      }}
    >
      <Tab.Screen
        name="Follow/Followers"
        options={{ title: "Followers" }}
        component={Followers}
        initialParams={route.params}
      />
      <Tab.Screen
        name="Follow/Following"
        options={{ title: "Following" }}
        component={Following}
        initialParams={route.params}
      />
    </Tab.Navigator>
  );
}

FollowRoute.propTypes = {
  type: PropTypes.oneOf(["following, followers"]),
};
