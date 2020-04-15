import styled from "styled-components/native";
import React from "react";
import { Text, Button, Icon } from "@ui-kitten/components";
import LoadingIndicator from "../LoadingIndicator";

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const EmptyImage = styled.Image`
  width: 100px;
  height: 100px;
  opacity: 0.3;
  transform: scale(2);
`;

export const EmptyText = styled(Text).attrs({ category: "s2" })`
  margin-top: 5px;
  opacity: 0.3;
  text-align: center;
`;
export const RefreshButton = styled(Button).attrs((props) => ({
  appearance: "ghost",
  status: "basic",
  size: "tiny",
  //   disabled: props.loading,
  icon: props.loading
    ? (styles) => <LoadingIndicator {...styles} />
    : (styles) => <Icon {...styles} name="chevron-down" />,
}))`
  margin-top: 20px;
  opacity: 0.6;
  /* pointer-events: none; */
  /* ${(props) =>
    props.loading &&
    `
  opacity: 1;`} */
`;
