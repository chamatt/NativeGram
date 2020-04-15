import React from "react";
import { Text, Button, Icon } from "@ui-kitten/components";
import { Container, EmptyImage, EmptyText, RefreshButton } from "./styles";

export default function EmptyList({ refetch, loading, text }) {
  return (
    <Container>
      <EmptyImage source={require("~/assets/img/gummy-powerbook.png")} />
      <EmptyText>{text}</EmptyText>

      {refetch && (
        <RefreshButton loading={loading} onPress={refetch}>
          Pull to Refresh
        </RefreshButton>
      )}
    </Container>
  );
}
