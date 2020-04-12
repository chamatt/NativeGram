import styled from "styled-components/native";
import { Dimensions } from "react-native";
import { Layout, Icon } from "@ui-kitten/components";

const width = Dimensions.get("screen").width;

export const ImagesScrollView = styled.ScrollView.attrs({
  horizontal: true,
  showsHorizontalScrollIndicator: false,
})`
  height: ${width / 3.5}px;
`;

export const ImageContainer = styled.TouchableOpacity`
  width: ${width / 3.5}px;
  height: ${width / 3.5}px;
  margin-right: 1px;
`;
export const ImageItem = styled.Image.attrs({ resizeMode: "cover" })`
  width: ${width / 3.5}px;
  height: ${width / 3.5}px;
`;

export const ImageNew = styled(Layout).attrs({ level: "4" })`
  width: ${width / 3.5}px;
  height: ${width / 3.5}px;
  align-items: center;
  justify-content: center;
`;

export const ImageNewIcon = styled(Icon).attrs((props) => ({
  tintColor: props.theme["text-basic-color"],
  name: "plus",
  size: "large",
}))`
  width: 20px;
  height: 20px;
`;
