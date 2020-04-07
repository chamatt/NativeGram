import React, { useEffect, useRef } from "react";
import { Layout, Text, Avatar, Button } from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { gql } from "apollo-boost";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useRoute, useNavigation } from "@react-navigation/native";
import Carousel from "react-native-snap-carousel";
import { Image, Dimensions } from "react-native";
import { LoadingPage } from "~/components/LoadingIndicator";
import {
  Container,
  Body,
  PostImage,
  Header,
  CarouselContainer,
  PostActions,
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

const CREATE_LIKE = gql`
  mutation createLike($userId: ID!, $postId: ID!) {
    createLike(input: { data: { user: $userId, post: $postId } }) {
      like {
        id
      }
    }
  }
`;

const HAS_LIKED = gql`
  query isLiked($userId: ID!, $postId: ID!) {
    likesConnection(where: { user: { id: $userId }, post: { id: $postId } }) {
      aggregate {
        count
      }
    }
  }
`;

const FETCH_POST = gql`
  query fetchPost($postId: ID!, $userId: ID!) {
    likesConnection(where: { post: { id: $postId } }) {
      aggregate {
        count
      }
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
        url
      }
      comments(limit: 5, sort: "createdAt:desc") {
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
  showViewAllComments = false,
}) => {
  const route = useRoute();
  const navigation = useNavigation();
  const carouselRef = useRef();
  const commentInputRef = useRef();
  const {
    post,
    user,
    likesCount,
    commentsCount,
    userHasLiked,
    postLoading,
    hasLikedLoading,
    postError,
    hasLikedError,
    createLike,
  } = usePost(userId, postId);

  if (postLoading || hasLikedLoading) return <LoadingPage />;
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
      {post?.images && (
        <CarouselContainer>
          <Carousel
            ref={carouselRef}
            data={post?.images}
            layout="default"
            renderItem={({ item }) => {
              return (
                <PostImage source={{ uri: item?.url }} resizeMode="cover" />
              );
            }}
            sliderWidth={wp("85%")}
            itemWidth={wp("85%")}
          />
        </CarouselContainer>
      )}
      <PostActions>
        <PostAction
          type="like"
          amount={likesCount}
          active={userHasLiked}
          onPress={() => createLike({ variables: { userId, postId } })}
        />
        <PostAction
          type="comment"
          amount={commentsCount}
          onPress={() => alert("Comment")}
        />
      </PostActions>
      <Body>
        <Text>{post?.description}</Text>
        <SizedBox height={20} />
        <Text category="h6">Comments</Text>
        <SizedBox height={20} />
        <CommentInput postId={postId}></CommentInput>

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
        <SizedBox height={20} />
        <Button
          size="tiny"
          status="basic"
          onPress={() => navigation.push("Comments", { postId })}
        >
          View All Comments
        </Button>
      </Body>
    </Container>
  );
};

function usePost(userId, postId) {
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
  const userHasLiked = hasLiked?.likesConnection?.aggregate?.count > 0;

  const {
    data: postData,
    loading: postLoading,
    error: postError,
    refetch: postRefetch,
  } = useQuery(FETCH_POST, {
    variables: {
      postId,
      userId,
    },
  });

  const [createLike, { data }] = useMutation(CREATE_LIKE, {
    onCompleted: () => {
      postRefetch();
    },
  });

  const likesCount = postData?.likesConnection?.aggregate?.count;
  const commentsCount = postData?.commentsConnection?.aggregate?.count;
  const post = postData?.post;
  const user = postData?.user;

  return {
    post,
    user,
    likesCount,
    commentsCount,
    userHasLiked,
    postLoading,
    hasLikedLoading,
    postError,
    hasLikedError,
    createLike,
    postRefetch,
  };
}

export default Post;
