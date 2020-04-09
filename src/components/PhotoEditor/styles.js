import React from "react";
import styled from "styled-components/native";
import { SafeAreaView } from "../SafeArea";
import { Camera } from "expo-camera";
import { Dimensions } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import { Icon, Button } from "@ui-kitten/components";

const { height, width } = Dimensions.get("window");
const newWidth = height * (3 / 4);
const newHeight = width * (4 / 3);

export const PhotoLoading = styled.View`
  background-color: black;
  height: ${newHeight}px;
  width: ${width}px;
  align-items: center;
  justify-content: center;
`;

export const PhotoContainer = styled.View`
  background-color: black;
  /* height: ${newHeight}px;
  width: ${width}px;
  align-items: center;
  justify-content: center; */
`;
export const Photo = styled.Image.attrs({
  resizeMode: "contain",
})`
  background-color: black;
  height: ${newHeight}px;
  width: ${width}px;

  ${(props) =>
    props.flipX &&
    `
    transform: rotateY(180deg);
  `}
`;

export const Container = styled(SafeAreaView)`
  justify-content: space-between;
  flex: 1;
  background-color: ${(props) => props.theme["background-basic-color-1"]};
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  padding: 10px;
  justify-content: flex-start;
`;

export const Footer = styled.View`
  flex-direction: row;
  flex: 1;
  align-items: center;
  padding: 20px;
  justify-content: space-around;
`;

export const FooterItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const FooterAcessory = styled.TouchableOpacity`
  width: 40px;
  height: 40px;
  justify-content: center;
  align-items: center;
`;
export const FooterAcessoryIcon = styled(Icon).attrs((props) => ({
  name: props.name,
  width: 20,
  height: 20,
  tintColor: props.theme["text-basic-color"],
}))`
  /* width: 30;
  height: 30; */
`;
