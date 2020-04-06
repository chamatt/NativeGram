import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView } from "react-native";
import { Container, Body } from "./styles";
import PostItem from "~/components/PostItem";
import { LoadingPage } from "~/components/LoadingIndicator";

const Post = () => {
  const route = useRoute();

  if (!route?.params) return <LoadingPage />;

  const { params: { postId = null, userId = null } = null } = route;

  return (
    <ScrollView>
      <Container>
        <PostItem userId={userId} postId={postId} />
      </Container>
    </ScrollView>
  );
};

export default Post;
