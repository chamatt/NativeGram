import styled from "styled-components/native";
import { Dimensions } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import cloudinary from "cloudinary-core";

const cl = new cloudinary.Cloudinary({
  cloud_name: "matheusvicente",
});

export const Container = styled.TouchableOpacity`
  /* padding: ${wp("5%")}px; */
  background-color: ${(props) => props.theme["background-basic-color-2"]}
`;

export const Thumbnail = styled.Image.attrs((props) => ({
  resizeMode: "contain",
  source: {
    uri: cl.url(props.publicId, {
      width: 250,
      height: 250,
      gravity: "faces",
      crop: "fill",
    }),
  },
}))`
  width: ${wp("33.3%")}px;
  height: ${wp("33.3%")}px;
  /* border-radius: ${wp("5%")}px; */
`;
