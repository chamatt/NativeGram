import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import cloudinary from "cloudinary-core";
const cl = new cloudinary.Cloudinary({
  cloud_name: "matheusvicente",
});

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
export const PostImagePlaceholder = styled.View`
  width: ${wp("85%")}px;
  height: ${wp("85%")}px;
  border-radius: 10px;
  background: black;
`;
export const PostImage = styled.Image.attrs((props) => ({
  resizeMode: "cover",
  source: {
    uri: cl.url(props.publicId, {
      width: 600,
      height: 600,
      gravity: "faces",
      crop: "fill",
    }),
  },
}))`
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
