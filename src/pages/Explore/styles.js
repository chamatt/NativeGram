import React from "react";
import styled from "styled-components/native";
import posed from "react-native-pose";
import { Input, Layout, Text, Icon } from "@ui-kitten/components";

export const Header = styled(Layout)`
  padding: 20px;
  padding-bottom: 0px;

  ${(props) =>
    props.active &&
    `
  padding: 10px;
  `}
`;
export const Body = styled(Layout)`
  padding-top: 0px;
  padding: 10px;
  flex: 1;
`;

export const SearchIcon = (style, theme) => (
  <Icon
    {...style}
    tintColor={theme["text-basic-color"]}
    name="search-outline"
  />
);
export const ClearIcon = (style, theme) => (
  <Icon {...style} tintColor={theme["text-basic-color"]} name="close-outline" />
);

export const PosedView = posed.View({
  closed: {
    opacity: 1,
    y: 0,
  },
  opened: {
    opacity: 1,
    y: -50,
  },
});

export const Box = posed.View({
  enter: { opacity: 1 },
  exit: { opacity: 0 },
});
