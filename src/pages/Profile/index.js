import React, { useEffect, useState } from "react";
import {
  Layout,
  Text,
  Button,
  Avatar,
  Spinner,
  Drawer,
  Icon,
  useTheme,
} from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";
import { View } from "react-native";
import FollowList from "~/components/FollowList";

import {
  Container,
  Header,
  Body,
  EditButton,
  UserAvatar,
  PieIcon,
  BirthdateContainer,
  BioContainer,
} from "./styles";
import { SafeAreaView, TopSafeArea } from "~/components/SafeArea";
import SizedBox from "~/components/SizedBox";
import LoadingIndicator, { LoadingPage } from "~/components/LoadingIndicator";
import Categories from "./components/Categories";
import PostThumbnail from "~/components/PostThumbnail";
import { FlatList } from "react-native";
import { defaultAvatar } from "~/constants";
import { format, parseISO } from "date-fns";
import { SharedElement } from "react-navigation-shared-element";
import maxLength from "~/utils/maxLength";
import EmptyList from "~/components/EmptyList";
import { uniqBy } from "lodash";
import UserItem from "~/components/UserItem";

const SettingsIcon = (style) => <Icon {...style} name="settings" />;

const FETCH_PROFILE = gql`
  query fetchProfile($id: ID!) {
    user(id: $id) {
      profile {
        id
        bio
        name
        birthdate
        avatar {
          url
        }
      }

      posts {
        id
      }
      followers {
        id
      }
      followings {
        id
      }
    }
  }
`;

const FETCH_POSTS = gql`
  query fetchPosts($id: ID!, $offset: Int!) {
    user(id: $id) {
      posts(sort: "createdAt:desc", start: $offset, limit: 9) {
        id
        images {
          id
          provider_metadata
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
  const params = route.params;
  const theme = useTheme();
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useQuery(FETCH_PROFILE, {
    variables: { id: route?.params?.userId || me },
  });
  const userId = route?.params?.userId;

  const {
    data: posts,
    loading: postsLoading,
    error: postsError,
    refetch: postsRefetch,
    fetchMore: fetchMorePosts,
    networkStatus,
  } = useQuery(FETCH_POSTS, {
    variables: { id: userId || me, offset: 0 },
  });

  useEffect(() => {
    if (params?.shouldReset) {
      postsRefetch();
    }
  }, [params]);

  const [notHasMore, setNotHasMore] = useState(false);

  function renderHeader() {
    const [showFullBio, setShowFullBio] = useState(false);
    const { text: bioText, overflow: bioOverflow } = maxLength(
      profile?.user?.profile?.bio,
      80
    );
    const toggleBio = () => {
      showFullBio ? setShowFullBio(false) : setShowFullBio(true);
    };

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
        <Text maxWidth={400} category="h5">
          {profile?.user?.profile?.name}
        </Text>
        <SizedBox height={10}></SizedBox>
        <BioContainer onPress={toggleBio}>
          <Text numberOfLines={showFullBio ? null : 4} category="p1">
            {showFullBio
              ? profile?.user?.profile?.bio
              : bioText?.trim().replace(/[\n\r]/gi, " ")}
          </Text>
        </BioContainer>
        <SizedBox height={10}></SizedBox>
        {profile?.user?.profile?.birthdate && (
          <BirthdateContainer>
            <PieIcon />
            <SizedBox width={3}></SizedBox>
            <Text category="c1">{profile?.user?.profile?.birthdate}</Text>
          </BirthdateContainer>
        )}
        <SizedBox height={20}></SizedBox>
        {(!userId || userId === me) && !profileLoading && (
          <EditButton onPress={() => navigation.navigate("EditProfile")}>
            Edit
          </EditButton>
        )}
        <Categories
          userId={route?.params?.userId}
          posts={profile?.user?.posts?.length}
          followers={profile?.user?.followers?.length}
          followings={profile?.user?.followings?.length}
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

  // if (profileLoading || postsLoading) return <LoadingPage />;
  return (
    <Container>
      <SafeAreaView>
        <Body>
          <FlatList
            ListHeaderComponent={renderHeader}
            onRefresh={() => {
              profileRefetch();
              postsRefetch();
            }}
            refreshing={networkStatus === 4}
            data={posts?.user?.posts}
            keyExtractor={(item) => item.id}
            renderItem={({ item: { images, id, user } }) => (
              <PostThumbnail
                onSelect={() =>
                  navigation.push("Post", { postId: id, userId: user?.id })
                }
                id={id}
                userId={user?.id}
                publicId={images?.[0]?.provider_metadata?.public_id}
                image={images?.[0]?.url}
              />
            )}
            numColumns={3}
            ListFooterComponent={() => {
              return postsLoading && <LoadingIndicator />;
            }}
            ListEmptyComponent={() => {
              return (
                <View style={{ height: 200 }}>
                  <EmptyList text="No Posts Yet" />
                </View>
              );
            }}
            onEndReachedThreshold={0.5}
            onEndReached={() => {
              if (!notHasMore) {
                fetchMorePosts({
                  variables: { offset: posts?.user?.posts?.length },
                  updateQuery: (prev, { fetchMoreResult }) => {
                    if (
                      !fetchMoreResult ||
                      !fetchMoreResult?.user?.posts?.length ||
                      fetchMoreResult?.user?.posts?.length === 0
                    ) {
                      setNotHasMore(true);
                      return prev;
                    }

                    const newPosts = uniqBy(
                      [...prev?.user?.posts, ...fetchMoreResult?.user?.posts],
                      "id"
                    );
                    return {
                      ...prev,
                      user: { ...prev.user, posts: newPosts },
                    };
                  },
                });
              }
            }}
          ></FlatList>
        </Body>
      </SafeAreaView>
    </Container>
  );
};

export default Profile;
