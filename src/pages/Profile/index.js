import React, { useEffect } from "react";
import {
  Layout,
  Text,
  Button,
  Avatar,
  Spinner,
  Drawer,
  Icon,
} from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";

import { Container, Header, Body, EditButton, UserAvatar } from "./styles";
import { SafeAreaView, TopSafeArea } from "~/components/SafeArea";
import SizedBox from "~/components/SizedBox";
import LoadingIndicator, { LoadingPage } from "~/components/LoadingIndicator";
import Categories from "./components/Categories";
import PostThumbnail from "~/components/PostThumbnail";
import { FlatList } from "react-native";
import { defaultAvatar } from "~/constants";

const SettingsIcon = (style) => <Icon {...style} name="settings" />;

const FETCH_PROFILE = gql`
  query fetchProfile($id: ID!) {
    user(id: $id) {
      profile {
        id
        bio
        name
        avatar {
          url
        }
      }
      posts {
        id
      }
      Followers {
        id
      }
    }
  }
`;

const FETCH_POSTS = gql`
  query fetchPosts($id: ID!) {
    user(id: $id) {
      posts {
        id
        images {
          id
          url
        }
        user {
          id
        }
      }
    }
  }
`;

const Profile = () => {
  const me = useStoreState((state) => state?.auth?.user?._id);
  const auth = useStoreState((state) => state.auth);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useQuery(FETCH_PROFILE, {
    variables: { id: route?.params?.userId || me },
  });
  const userId = route?.params?.userId;

  const { data: posts, loading: postsLoading, error: postsError } = useQuery(
    FETCH_POSTS,
    {
      variables: { id: userId || me },
    }
  );
  function renderHeader() {
    return (
      <Header>
        <UserAvatar
          size="giant"
          source={
            profile?.user?.profile?.avatar?.url
              ? { uri: profile?.user?.profile?.avatar?.url }
              : defaultAvatar
          }
        />
        <SizedBox height={20}></SizedBox>
        <Text category="h5">{profile?.user?.profile?.name}</Text>
        <Text category="p1">{profile?.user?.profile?.bio}</Text>
        <SizedBox height={20}></SizedBox>
        {(!userId || userId === me) && (
          <EditButton onPress={() => navigation.navigate("EditProfile")}>
            Edit
          </EditButton>
        )}
        <Categories
          posts={profile?.user?.posts?.length}
          followers={profile?.user?.Followers?.length}
        />
      </Header>
    );
  }

  useEffect(() => {
    if (!userId || userId === me) {
      navigation.setOptions({
        headerRight: () => (
          <Button
            appearance="ghost"
            status="basic"
            onPress={() => navigation.navigate("Settings")}
            icon={SettingsIcon}
          ></Button>
        ),
      });
    }
  }, [userId]);

  if (profileLoading) return <LoadingPage />;
  return (
    <Container>
      <SafeAreaView>
        <Body>
          <FlatList
            ListHeaderComponent={renderHeader}
            onRefresh={() => profileRefetch()}
            refreshing={profileLoading || postsLoading}
            data={posts?.user?.posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item: { images, id, user } }) => (
              <PostThumbnail
                id={id}
                userId={user?.id}
                image={images?.[0]?.url}
              />
            )}
            numColumns={2}
          ></FlatList>
        </Body>
      </SafeAreaView>
    </Container>
  );
};

export default Profile;
