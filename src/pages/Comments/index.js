import React, { useRef, useState, useMemo } from "react";
import { Text, useTheme } from "@ui-kitten/components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Dimensions, FlatList } from "react-native";
import LoadingIndicator, { LoadingPage } from "~/components/LoadingIndicator";
import { Container, Body } from "./styles";
import SizedBox from "~/components//SizedBox";
import CommentItem from "~/components//CommentItem";
import CommentInput from "~/components//CommentInput";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { SafeAreaView } from "~/components/SafeArea";
import { uniqBy } from "lodash";
import { Image } from "react-native";
import EmptyList from "~/components/EmptyList";

const FETCH_COMMENTS = gql`
  query fetchComments($postId: ID!, $offset: Int!) {
    comments(
      where: { post: $postId }
      sort: "createdAt:desc"
      start: $offset
      limit: 10
    ) {
      id
      createdAt
      user {
        id
        username
        profile {
          avatar {
            url
          }
        }
      }
      text
    }
  }
`;
const WIDTH = Dimensions.get("screen").width;

const Comments = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const theme = useTheme();
  const { data, loading, error, refetch, fetchMore, networkStatus } = useQuery(
    FETCH_COMMENTS,
    {
      variables: {
        postId: route?.params?.postId,
        offset: 0,
      },
      notifyOnNetworkStatusChange: true,
    }
  );

  const [notHasMore, setNotHasMore] = useState(false);

  const renderHeader = useMemo(
    () => (
      <>
        <SizedBox height={20} />
        <Text category="h6">Comments</Text>
        <SizedBox height={20} />
        <CommentInput postId={route?.params?.postId}></CommentInput>
        <SizedBox height={20} />
      </>
    ),
    [route?.params?.postId]
  );

  //   useEffect(() => {
  //     const subscribeToNewComments = () => {
  //       subscribeToMore({
  //         document: COMMENTS_SUBSCRIPTION,
  //         variables: { repoName: params.repoName },
  //         updateQuery: (prev, { subscriptionData }) => {
  //           if (!subscriptionData.data) return prev;
  //           const newFeedItem = subscriptionData.data.commentAdded;

  //           return Object.assign({}, prev, {
  //             entry: {
  //               comments: [newFeedItem, ...prev.entry.comments],
  //             },
  //           });
  //         },
  //       });
  //     };
  //   }, [subscribeToMore]);

  //   if (loading) return <LoadingPage />;
  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            flex: 1,
            width: widthPercentageToDP("100%"),
            paddingHorizontal: 20,
            paddingBottom: 30,
            backgroundColor: theme["background-basic-color-1"],
          }}
          ListHeaderComponent={renderHeader}
          onRefresh={() => {
            setNotHasMore(false);
            refetch();
          }}
          refreshing={networkStatus === 4}
          data={data?.comments}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          renderItem={({ item: comment }) => {
            return (
              <>
                <CommentItem
                  userId={comment?.user?.id}
                  id={comment?.id}
                  key={comment?.id}
                  avatar={comment?.user?.profile?.avatar?.url}
                  author={comment?.user?.username}
                  body={comment?.text}
                  date={comment?.createdAt}
                ></CommentItem>
                <SizedBox height={10} />
              </>
            );
          }}
          ListFooterComponent={() => {
            return loading && <LoadingIndicator />;
          }}
          ListEmptyComponent={() => {
            return (
              <EmptyList
                text="No Comments Yet"
                loading={loading}
                refetch={refetch}
              />
            );
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (!notHasMore) {
              fetchMore({
                variables: { offset: data?.comments?.length + 1 },
                updateQuery: (prev, { fetchMoreResult }) => {
                  if (
                    !fetchMoreResult ||
                    !fetchMoreResult?.comments?.length ||
                    fetchMoreResult?.comments?.length === 0
                  ) {
                    setNotHasMore(true);
                    return prev;
                  }

                  const newComments = uniqBy(
                    [...prev?.comments, ...fetchMoreResult?.comments],
                    "id"
                  );
                  return {
                    ...prev,
                    comments: newComments,
                  };
                },
              });
            }
          }}
        ></FlatList>
      </SafeAreaView>
    </Container>
  );
};

export default Comments;
