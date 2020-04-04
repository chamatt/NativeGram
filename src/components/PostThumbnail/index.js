import React from "react";

import { Container, Thumbnail } from "./styles";

export default function PostThumbnail({ image, onSelect, ...rest }) {
  return (
    <Container onPress={onSelect} {...rest}>
      <Thumbnail source={{ uri: image }}></Thumbnail>
    </Container>
  );
}
