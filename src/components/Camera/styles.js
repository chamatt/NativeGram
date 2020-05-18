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

export const ExpoCameraPlaceholder = styled.View`
  background-color: black;
  height: ${width}px;
  width: ${width}px;
`;

export const ExpoCamera = styled(Camera)`
  height: ${newHeight}px;
  width: ${width}px;
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

const galleryIcon = (style) => <Icon {...style} name="grid" />;

export const GalleryButton = styled(Button).attrs({
  appearance: "ghost",
  status: "primary",
  icon: galleryIcon,
})``;

export const CameraButton = styled.TouchableOpacity.attrs((props) => ({
  disabled: props.loading,
}))`
  width: 64px;
  height: 64px;
  border-radius: 32px;
  background-color: ${(props) =>
    props.loading
      ? props.theme["color-basic-disabled"]
      : props.theme["color-primary-default"]};
  justify-content: center;
  align-items: center;
`;
export const FooterItem = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex: 1;
`;

export const CameraButtonIcon = styled(Icon).attrs((props) => ({
  name: "camera-outline",
  width: 30,
  height: 30,
  tintColor: "#FFFFFF",
}))`
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

const mediaLibraryHeight = 100;

export const MediaLibraryContainer = styled.View`
  height: ${mediaLibraryHeight}px;
  /* flex: 1; */
  /* width: 100%; */
  /* background: red; */
`;

export const MediaLibraryScrollView = styled.FlatList.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  height: ${mediaLibraryHeight}px;
`;

export const MediaLibraryItemContainer = styled.TouchableOpacity`
  height: ${mediaLibraryHeight}px;
  width: ${mediaLibraryHeight}px;
  /* background: blue; */
  /* padding: 10px; */
  /* width: 100%; */
`;
export const MediaLibraryItem = styled.Image.attrs({ resizeMode: "cover" })`
  height: ${mediaLibraryHeight}px;
  width: ${mediaLibraryHeight}px;
`;
