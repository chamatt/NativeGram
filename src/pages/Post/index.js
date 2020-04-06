import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView } from "react-native";
import { Container, Body } from "./styles";
import PostItem from "~/components/PostItem";
import { LoadingPage } from "~/components/LoadingIndicator";
import { Layout } from "@ui-kitten/components";

const Post = () => {
  const route = useRoute();

  if (!route?.params) return <LoadingPage />;

  const { params: { postId = null, userId = null } = null } = route;

  return (
    <Layout level="3">
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container>
          <PostItem userId={userId} postId={postId} />
        </Container>
      </ScrollView>
    </Layout>
  );
};

export default Post;
