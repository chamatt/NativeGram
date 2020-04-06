import React from "react";

import { Container, Thumbnail } from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function PostThumbnail({
  id,
  userId,
  image,
  onSelect,
  ...rest
}) {
  const navigation = useNavigation();
  return (
    <Container
      onPress={() =>
        navigation.navigate("Post", { postId: id, userId: userId })
      }
      {...rest}
    >
      <Thumbnail source={{ uri: image }}></Thumbnail>
    </Container>
  );
}
