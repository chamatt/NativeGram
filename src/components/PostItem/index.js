import React, { useEffect, useRef, useState } from "react";
import { Layout, Text, Avatar, Button, useTheme } from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import { Image, Dimensions } from "react-native";
import { LoadingPage } from "~/components/LoadingIndicator";
import {
  Container,
  Body,
  PostImage,
  Header,
  CarouselContainer,
  PostActions,
  PostImagePlaceholder,
} from "./styles";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import PostAction from "~/components/PostAction";
import SizedBox from "~/components/SizedBox";
import CommentItem from "~/components/CommentItem";
import { defaultAvatar } from "~/constants/";
import CommentInput from "~/components/CommentInput";
import { SharedElement } from "react-navigation-shared-element";

const CREATE_LIKE = gql`
  mutation createLike($userId: ID!, $postId: ID!) {
    createLike(input: { data: { user: $userId, post: $postId } }) {
      like {
        id
      }
    }
  }
`;
const DELETE_LIKE = gql`
  mutation deleteLike($id: ID!) {
    deleteLike(input: { where: { id: $id } }) {
      like {
        id
      }
    }
  }
`;

const HAS_LIKED = gql`
  query isLiked($userId: ID!, $postId: ID!) {
    userLikes: likes(where: { user: { id: $userId }, post: { id: $postId } }) {
      id
    }
  }
`;

const FETCH_POST = gql`
  query fetchPost($postId: ID!, $userId: ID!, $amountComments: Int) {
    likesConnection(where: { post: { id: $postId } }) {
      aggregate {
        count
      }
    }
    userLikes: likes(where: { user: { id: $userId }, post: { id: $postId } }) {
      id
    }

    commentsConnection(where: { post: { id: $postId } }) {
      aggregate {
        count
      }
    }
    post(id: $postId) {
      id
      description
      images {
        id
        url
        provider_metadata
      }
      comments(limit: $amountComments, sort: "createdAt:desc") {
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
    user(id: $userId) {
      profile {
        id
        avatar {
          url
        }
        name
      }
    }
  }
`;
const WIDTH = Dimensions.get("screen").width;

const Post = ({
  userId,
  postId,
  showInput = false,
  showViewAllComments = true,
  amountComments = 3,
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const carouselRef = useRef();
  const commentInputRef = useRef();
  const theme = useTheme();
  const {
    post,
    user,
    likesCount,
    likesLoading,
    commentsCount,
    userHasLiked,
    postLoading,
    postError,
    createLike,
    deleteLike,
  } = usePost(userId, postId, amountComments);

  const [selectedIndex, setSelectedIndex] = useState(0);

  // if (postLoading || hasLikedLoading) return <LoadingPage />;
  return (
    <Container>
      <Header
        onPress={() =>
          navigation.push("Profile", {
            userId,
          })
        }
      >
        <Avatar
          source={
            user?.profile?.avatar?.url
              ? { uri: user?.profile?.avatar?.url }
              : defaultAvatar
          }
        ></Avatar>
        <SizedBox width={10} />
        <Text category="s1">{user?.profile?.name || user?.username}</Text>
      </Header>

      {postLoading && (
        <CarouselContainer>
          <SharedElement id={`post.${postId}.photo`}>
            <PostImagePlaceholder />
          </SharedElement>
        </CarouselContainer>
      )}
      {!postLoading && post?.images && (
        <CarouselContainer>
          <Carousel
            removeClippedSubviews={false}
            onSnapToItem={(index) => setSelectedIndex(index)}
            ref={carouselRef}
            data={post?.images}
            layout="default"
            renderItem={({ item }) => {
              if (item?.url === post?.images?.[0]?.url) {
                return (
                  <SharedElement id={`post.${postId}.photo`}>
                    <PostImage
                      publicId={item?.provider_metadata?.public_id}
                      resizeMode="cover"
                    />
                  </SharedElement>
                );
              }
              return (
                <PostImage
                  publicId={item?.provider_metadata?.public_id}
                  resizeMode="cover"
                />
              );
            }}
            sliderWidth={wp("100%")}
            itemWidth={wp("100%")}
          />
        </CarouselContainer>
      )}
      <Pagination
        dotsLength={post?.images?.length || 0}
        activeDotIndex={selectedIndex}
        containerStyle={{ paddingBottom: 0, paddingTop: 20 }}
        dotStyle={{
          backgroundColor: theme["text-primary-color"],
        }}
      />
      <PostActions>
        <PostAction
          type="like"
          amount={likesCount}
          active={userHasLiked}
          loading={likesLoading}
          onPress={() =>
            userHasLiked
              ? deleteLike({ variables: { userId, postId } })
              : createLike({ variables: { userId, postId } })
          }
        />
        <PostAction
          type="comment"
          amount={commentsCount}
          onPress={() => navigation.push("Comments", { postId })}
        />
      </PostActions>
      <Body>
        <Text>{post?.description}</Text>

        {post?.comments?.length ? (
          <>
            <SizedBox height={20} />
            <Text category="h6">Comments</Text>
          </>
        ) : null}
        {showInput && (
          <>
            <SizedBox height={20} />
            <CommentInput postId={postId}></CommentInput>
          </>
        )}
        <SizedBox height={20} />
        <Layout>
          {post?.comments?.map((comment) => (
            <CommentItem
              userId={comment?.user?.id}
              id={comment?.id}
              key={comment?.id}
              avatar={comment?.user?.profile?.avatar?.url}
              author={comment?.user?.username}
              body={comment?.text}
              date={comment?.createdAt}
            ></CommentItem>
          ))}
        </Layout>
        {showViewAllComments && (
          <>
            {/* <SizedBox height={20} /> */}
            <Button
              size="tiny"
              appearance="ghost"
              status="basic"
              onPress={() => navigation.push("Comments", { postId })}
            >
              View All Comments
            </Button>
          </>
        )}
      </Body>
    </Container>
  );
};

function usePost(userId, postId, amountComments) {
  const {
    data: hasLiked,
    loading: hasLikedLoading,
    error: hasLikedError,
  } = useQuery(HAS_LIKED, {
    variables: {
      postId,
      userId,
    },
  });

  const {
    data: postData,
    loading: postLoading,
    error: postError,
    refetch: postRefetch,
  } = useQuery(FETCH_POST, {
    variables: {
      postId,
      userId,
      amountComments,
    },
  });

  const [createLikeMutation, { loading: createLikeLoading }] = useMutation(
    CREATE_LIKE,
    {
      onCompleted: async () => {
        await postRefetch();
      },

      refetchQueries: ["isLiked"],
      awaitRefetchQueries: true,
    }
  );
  const [deleteLikeMutation, { loading: deleteLikeLoading }] = useMutation(
    DELETE_LIKE,
    {
      onCompleted: async () => {
        await postRefetch();
      },
      refetchQueries: ["isLiked"],
      awaitRefetchQueries: true,
    }
  );

  const likesCount = postData?.likesConnection?.aggregate?.count;
  const userHasLiked = Boolean(postData?.userLikes?.length);
  const userLikes = hasLiked?.userLikes;
  const commentsCount = postData?.commentsConnection?.aggregate?.count;
  const post = postData?.post;
  const user = postData?.user;
  const likesLoading = createLikeLoading || deleteLikeLoading;

  const deleteLike = () => {
    if (!deleteLikeLoading && hasLiked?.userLikes?.length) {
      deleteLikeMutation({
        variables: {
          id: hasLiked?.userLikes?.[0]?.id,
        },
      });
    }
  };
  const createLike = (payload) => {
    if (!createLikeLoading && !hasLiked?.userLikes?.length) {
      createLikeMutation({
        ...payload,
      });
    }
  };

  return {
    post,
    user,
    likesCount,
    likesLoading,
    commentsCount,
    userHasLiked,
    postLoading,
    postError,
    createLike,
    deleteLike,
    postRefetch,
  };
}

export default Post;
