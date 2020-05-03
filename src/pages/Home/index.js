import React from "react";
import { Layout, Text } from "@ui-kitten/components";
import { gql } from "apollo-boost";
import { useStoreState } from "easy-peasy";
import { useQuery } from "@apollo/react-hooks";
import { FlatList } from "react-native";
import PostItem from "~/components/PostItem";
import { SafeAreaView } from "~/components/SafeArea";
import EmptyList from "~/components/EmptyList";
import LoadingIndicator from "~/components/LoadingIndicator";

const GET_FEED = gql`
  query getFeed($userId: ID!) {
    posts(
      sort: "createdAt:desc"
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
    error: feedError,
  } = useQuery(GET_FEED, {
    variables: {
      userId: me,
    },
  });

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
            return feedLoading && <LoadingIndicator />;
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyList
                text="No Comments Yet"
                loading={feedLoading}
                refetch={feedRefetch}
              />
            );
          }}
          refreshing={feedLoading}
          onRefresh={feedRefetch}
        />
      </SafeAreaView>
    </Layout>
  );
};

export default Home;
