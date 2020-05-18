import React from "react";

import { Container, Thumbnail } from "./styles";
import { useNavigation } from "@react-navigation/native";
import { SharedElement } from "react-navigation-shared-element";
import {
  Image,
  Video,
  Transformation,
  CloudinaryContext,
} from "cloudinary-react";

export default function PostThumbnail({
  id,
  userId,
  image,
  publicId,
  onSelect,
  ...rest
}) {
  const navigation = useNavigation();
  return (
    <Container onPress={onSelect} {...rest}>
      <SharedElement key={id} id={`post.${id}.photo`}>
        <Thumbnail
          publicId={publicId}
          // source={{ uri: image }}
        ></Thumbnail>
      </SharedElement>
    </Container>
  );
}
