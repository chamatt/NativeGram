import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Container = styled(Layout)`
  /* width: ${wp("90%")}px; */
  width: 100%;
  /* border-radius: 15px; */
`;

export const Header = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  padding: ${wp("5%")}px;
`;

export const Body = styled(Layout)`
  padding: 0px 20px;
  padding-bottom: 20px;
  border-radius: ${wp("3%")}px;
`;

export const PostImage = styled.Image.attrs({ resizeMode: "cover" })`
  width: ${wp("85%")}px;
  height: ${wp("85%")}px;

  border-radius: 10px;

  /* border-top-right-radius: ${wp("3%")}px;
  border-top-left-radius: ${wp("3%")}px; */
`;

export const CarouselContainer = styled(Layout)`
  align-items: center;
  width: 100%;
  /* background: red; */
`;

export const PostActions = styled(Layout)`
  flex-direction: row;
  padding: 10px 20px;
  align-items: center;
`;
