import styled from "styled-components/native";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Container = styled.TouchableOpacity`
  padding: ${wp("5%")}px;
`;

export const Thumbnail = styled.ImageBackground.attrs({
  resizeMode: "cover",
  imageStyle: { borderRadius: wp("5%") },
})`
  width: ${wp("40%")}px;
  height: ${wp("40%")}px;
`;
