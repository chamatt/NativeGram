import React from "react";
import styled from "styled-components/native";
import { Layout, Text, Button, Icon, Avatar } from "@ui-kitten/components";
import { Dimensions } from "react-native";

const EditIcon = (style) => <Icon {...style} name="edit-2" />;

const PieChartIcon = (style) => <Icon {...style} name="pie-chart-2" />;

export const PieIcon = styled(PieChartIcon).attrs((props) => ({
  namme: "pie-chart-2",
  tintColor: props.theme["text-danger-color"],
  width: 15,
  height: 15,
}))`
  padding-right: 5px;
`;

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

export const BirthdateContainer = styled.View`
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export const BioContainer = styled.TouchableOpacity`
  align-self: center;
  padding: 0 20px;
`;
