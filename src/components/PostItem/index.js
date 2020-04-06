import React, { useEffect, useRef } from "react";
import { Layout, Text, Avatar, Button } from "@ui-kitten/components";
import { useStoreActions, useStoreState } from "easy-peasy";
import { gql } from "apollo-boost";
import { useQuery } from "@apollo/react-hooks";
import { useRoute } from "@react-navigation/native";
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
import PostAction from "../PostAction";
import SizedBox from "../SizedBox";

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
  query getPost($postId: ID!, $userId: ID!) {
    likesConnection(where: { post: { id: $postId } }) {
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
    }
    user(id: $userId) {
      profile {
        avatar {
          url
        }
        name
      }
    }
  }
`;
const WIDTH = Dimensions.get("screen").width;

const Post = ({ userId, postId }) => {
  const route = useRoute();
  const carouselRef = useRef();
  const {
    post,
    user,
    likes,
    userHasLiked,
    postLoading,
    hasLikedLoading,
    postError,
    hasLikedError,
  } = usePost(userId, postId);

  if (postLoading || hasLikedLoading) return <LoadingPage />;
  return (
    <Container>
      <Header>
        <Avatar source={{ uri: user?.profile?.avatar?.url }}></Avatar>
        <SizedBox width={10} />
        <Text category="s1">{user?.profile?.name || user?.username}</Text>
      </Header>
      <CarouselContainer>
        <Carousel
          ref={carouselRef}
          data={post?.images}
          layout="default"
          renderItem={({ item }) => {
            return <PostImage source={{ uri: item?.url }} resizeMode="cover" />;
          }}
          sliderWidth={wp("85%")}
          itemWidth={wp("85%")}
        />
      </CarouselContainer>
      <PostActions>
        <PostAction
          type="like"
          amount={likes}
          active={userHasLiked}
          onPress={() => alert("Like")}
        />
        <PostAction type="comment" onPress={() => alert("Comment")} />
      </PostActions>
      <Body>
        <Text>{post?.description}</Text>
        <SizedBox height={20} />
        <Button size="small" appearance="outline">
          Show Comments
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

  const { data: postData, loading: postLoading, error: postError } = useQuery(
    FETCH_POST,
    {
      variables: {
        postId,
        userId,
      },
    }
  );
  const likes = postData?.likesConnection?.aggregate?.count;
  const post = postData?.post;
  const user = postData?.user;

  return {
    post,
    user,
    likes,
    userHasLiked,
    postLoading,
    hasLikedLoading,
    postError,
    hasLikedError,
  };
}

export default Post;
