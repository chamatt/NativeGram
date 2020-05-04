import React, { useState } from "react";
import { Layout, Text } from "@ui-kitten/components";
import { gql } from "apollo-boost";
import { useStoreState } from "easy-peasy";
import { useQuery } from "@apollo/react-hooks";
import { FlatList, View } from "react-native";
import PostItem from "~/components/PostItem";
import { SafeAreaView } from "~/components/SafeArea";
import EmptyList from "~/components/EmptyList";
import LoadingIndicator from "~/components/LoadingIndicator";
import { uniqBy } from "lodash";
import SizedBox from "~/components/SizedBox";

const GET_FEED = gql`
  query getFeed($userId: ID!, $offset: Int!) {
    posts(
      sort: "createdAt:desc"
      start: $offset
      limit: 10
      where: { user: { followers: { follower: { id: $userId } } } }
    ) {
      id
      description
      images {
        id
        provider_metadata
        url
      }
      user {
        id
        username
      }
    }
  }
`;

const Home = () => {
  const me = useStoreState((state) => state?.auth?.user?._id);
  const {
    data: feed,
    loading: feedLoading,
    refetch: feedRefetch,
    fetchMore: fetchMorePosts,
    error: feedError,
    networkStatus,
  } = useQuery(GET_FEED, {
    variables: {
      userId: me,
      offset: 0,
    },
    skip: !me,
    notifyOnNetworkStatusChange: true,
  });

  const [notHasMore, setNotHasMore] = useState(false);

  console.log(feed);
  return (
    <Layout
      style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      level="3"
    >
      <SafeAreaView>
        <FlatList
          keyExtractor={(item) => item.id}
          data={feed?.posts}
          ItemSeparatorComponent={() => (
            <Layout level="3" style={{ margin: 1 }} />
          )}
          renderItem={({ item: post }) => {
            return (
              <PostItem
                userId={post?.user?.id}
                postId={post?.id}
                showInput={false}
                showViewAllComments
                amountComments={2}
              />
            );
          }}
          ListFooterComponent={() => {
            return (
              feedLoading && (
                <>
                  <SizedBox height={20} />
                  <LoadingIndicator />
                  <SizedBox height={20} />
                </>
              )
            );
          }}
          ListEmptyComponent={() => {
            return (
              <View style={{ height: 400 }}>
                <EmptyList
                  text="Your feed is empty. Follow some friends!"
                  // loading={feedLoading}
                  refetch={feedRefetch}
                />
              </View>
            );
          }}
          refreshing={feedLoading}
          refreshing={networkStatus === 4}
          onRefresh={feedRefetch}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!notHasMore) {
              fetchMorePosts({
                variables: { offset: feed?.posts?.length },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (
                    !fetchMoreResult ||
                    !fetchMoreResult?.posts?.length ||
                    fetchMoreResult?.posts?.length === 0
                  ) {
                    setNotHasMore(true);
                    return prev;
                  }
                  console.log("prev", prev?.posts?.length);
                  console.log("nextLengh", fetchMoreResult?.posts);

                  const newPosts = uniqBy(
                    [...prev?.posts, ...fetchMoreResult?.posts],
                    "id"
                  );
                  // console.log("newPosts.length", newPosts.length);
                  return {
                    ...prev,
                    posts: newPosts,
                  };
                },
              });
            }
          }}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Home;
