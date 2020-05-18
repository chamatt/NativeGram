import React from "react";
import { View } from "react-native";
import Camera from "~/components/Camera";
import PhotoEditor from "~/components/PhotoEditor";
import { useRoute } from "@react-navigation/native";
import { useStoreActions, useStoreState } from "easy-peasy";

// import { Container } from './styles';

export default function CreatePostEditor() {
  const route = useRoute();
  const { image, flipX } = route.params;
  const saveImage = useStoreActions((actions) => actions.createPost.saveImage);

  return (
    <PhotoEditor
      image={image}
      saveImage={saveImage}
      redirectTo="CreatePost/Save"
      flipX={flipX}
    />
  );
}
