import React, { useRef } from "react";
import { Text, useTheme } from "@ui-kitten/components";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Dimensions, FlatList } from "react-native";
import { LoadingPage } from "~/components/LoadingIndicator";
import { Container, Body } from "./styles";
import SizedBox from "~/components//SizedBox";
import CommentItem from "~/components//CommentItem";
import CommentInput from "~/components//CommentInput";
import { widthPercentageToDP } from "react-native-responsive-screen";
import { SafeAreaView } from "~/components/SafeArea";

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
  const {
    data,
    loading,
    error,
    refetch,
    fetchMore,
    subscribeToMore,
  } = useQuery(FETCH_COMMENTS, {
    variables: {
      postId: route?.params?.postId,
      offset: 0,
    },
  });

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

  if (loading) return <LoadingPage />;
  return (
    <Container>
      <SafeAreaView style={{ flex: 1 }}>
        <FlatList
          contentContainerStyle={{
            width: widthPercentageToDP("90%"),
            paddingHorizontal: 20,
            paddingBottom: 30,
            marginVertical: 20,

            borderRadius: widthPercentageToDP("3%"),
            backgroundColor: theme["background-basic-color-1"],
          }}
          ListHeaderComponent={() => (
            <>
              <SizedBox height={20} />
              <Text category="h6">Comments</Text>
              <SizedBox height={20} />
              <CommentInput postId={route?.params?.postId}></CommentInput>
              <SizedBox height={20} />
            </>
          )}
          onRefresh={refetch}
          refreshing={loading}
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
          onEndReached={() => {
            fetchMore({
              variables: { offset: data?.comments?.length + 1 },
              updateQuery: (prev, { fetchMoreResult }) => {
                if (
                  !fetchMoreResult ||
                  !fetchMoreResult?.comments?.length ||
                  fetchMoreResult?.comments?.length === 0
                )
                  return prev;
                return {
                  ...prev,
                  comments: [...prev?.comments, ...fetchMoreResult?.comments],
                };
              },
            });
          }}
        ></FlatList>
      </SafeAreaView>
    </Container>
  );
};

export default Comments;
