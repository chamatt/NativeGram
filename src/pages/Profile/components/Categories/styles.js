import styled from "styled-components/native";
import { Layout, Text } from "@ui-kitten/components";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const WIDTH = Dimensions.get("screen").width;

export const CategoryContainer = styled(Layout)`
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
  width: 100%;
`;
export const CategoryItem = styled(Layout)`
  align-items: center;
  justify-content: center;
  padding: 20px 10px;
  width: ${wp("25%")}px;
`;

export const CategoryCount = styled(Text).attrs({
  category: "h6",
  status: "info",
})`
  padding-bottom: 2px;
`;
export const CategoryTitle = styled(Text).attrs({ category: "s1" })`
  color: ${(props) => props.theme["text-hint-color"]};
`;