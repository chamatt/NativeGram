import React from "react";
import { useStoreActions, useStoreState } from "easy-peasy";
import { useRoute, useNavigation } from "@react-navigation/native";
import { Image, Dimensions, ScrollView } from "react-native";
import { Container, Body } from "./styles";
import PostItem from "~/components/PostItem";
import { LoadingPage } from "~/components/LoadingIndicator";
import { Layout } from "@ui-kitten/components";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SharedElement } from "react-navigation-shared-element";

const Post = () => {
  const route = useRoute();

  if (!route?.params) return <LoadingPage />;

  const { params: { postId = null, userId = null } = null } = route;

  return (
    <Layout level="3" style={{ flex: 1 }}>
      <KeyboardAwareScrollView
        showsVerticalScrollIndicator={false}
        extraHeight={150}
      >
        <Container>
          <PostItem
            userId={userId}
            postId={postId}
            showInput
            showViewAllComments
            amountComments={3}
          />
        </Container>
      </KeyboardAwareScrollView>
    </Layout>
  );
};

export default Post;
