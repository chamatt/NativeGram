import React from "react";
import PropTypes from "prop-types";
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

EmptyList.propTypes = {
  refetch: PropTypes.func,
  loading: PropTypes.bool,
  text: PropTypes.string,
};
EmptyList.defaultProps = {
  refetch: null,
  loading: false,
  text: "",
};
