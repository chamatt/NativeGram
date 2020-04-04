import React from "react";
import styled from "styled-components/native";
import { Layout, Text, Button, Icon, Avatar } from "@ui-kitten/components";
import { Dimensions } from "react-native";

const EditIcon = (style) => <Icon {...style} name="edit-2" />;

export const Container = styled(Layout)`
  flex: 1;
`;

export const UserAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
`;

export const Header = styled(Layout).attrs({ level: "1" })`
  align-items: center;
  width: 100%;
  padding: 20px 0;
`;
export const Body = styled(Layout).attrs({ level: "3" })`
  flex: 1;
  width: 100%;
`;
export const EditButton = styled(Button).attrs({
  appearance: "outline",
  status: "basic",
  size: "tiny",
  icon: EditIcon,
})``;
