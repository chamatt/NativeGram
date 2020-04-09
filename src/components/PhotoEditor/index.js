import React, { useEffect, useState, useRef } from "react";
import { View, StatusBar, Platform, Modal } from "react-native";

import {
  Container,
  Header,
  Footer,
  Photo,
  CameraButton,
  CameraButtonIcon,
  FooterItem,
  FooterAcessory,
  FooterAcessoryIcon,
  GalleryButton,
  PhotoLoading,
  PhotoContainer,
} from "./styles";
import { SafeAreaView, TopSafeArea } from "../SafeArea";
import { Button, Layout, Text, Icon, useTheme } from "@ui-kitten/components";
import { Camera as RNCamera } from "expo-camera";
import {
  useNavigation,
  useIsFocused,
  useRoute,
} from "@react-navigation/native";
import { useEvaTheme } from "~/context/ThemeContext";
import LoadingIndicator from "~/components/LoadingIndicator";
// import { Shaders, Node, GLSL } from "gl-react";
// import { Surface } from "gl-react-expo";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import * as ImageManipulator from "expo-image-manipulator";

// const shaders = Shaders.create({
//   Saturate: {
//     frag: GLSL`
//   precision highp float;
//   varying vec2 uv;
//   uniform sampler2D t;
//   uniform float contrast, saturation, brightness;
//   const vec3 L = vec3(0.2125, 0.7154, 0.0721);
//   void main() {
//     vec4 c = texture2D(t, uv);
//       vec3 brt = c.rgb * brightness;
//       gl_FragColor = vec4(mix(
//       vec3(0.5),
//       mix(vec3(dot(brt, L)), brt, saturation),
//       contrast), c.a);
//   }
//   `,
//   },
// });

// export const Saturate = ({ contrast, saturation, brightness, children }) => (
//   <Node
//     shader={shaders.Saturate}
//     uniforms={{ contrast, saturation, brightness, t: children }}
//   />
// );

const processImage = async (img) => {
  if (img.exif && img.exif.Orientation) {
    return await ImageManipulator.manipulateAsync(img.uri, [
      { rotate: -img.exif.Orientation },
    ]);
  }
  return img;
};

const flipImage = async (img) => {
  return await ImageManipulator.manipulateAsync(
    img.uri,
    [{ flip: ImageManipulator.FlipType.Horizontal }]
    // { compress: 1, format: ImageManipulator.SaveFormat.JPEG }
  );
};

export default function PhotoEditor({ image, flipX, loading, onBack }) {
  const navigation = useNavigation();
  const theme = useTheme();
  const { themeType } = useEvaTheme();
  const [editedImage, setEditedImage] = useState(null);
  const [showOriginal, setShowOriginal] = useState(true);

  console.log(image);
  useEffect(() => {
    (async () => {
      const processedImage = await processImage(image);
      if (flipX) {
        const flippedImage = await flipImage(processedImage);
        setEditedImage(flippedImage);
      } else {
        setEditedImage(processedImage);
        setShowOriginal(false);
      }
    })();
  }, [image]);

  return (
    <SafeAreaView>
      <Container>
        <StatusBar
          backgroundColor={theme["background-basic-color-1"]}
          barStyle={themeType === "light" ? "dark-content" : "light-content"}
        />
        <Header>
          <Button onPress={() => onBack()}>Close</Button>
        </Header>
        {loading || !image ? (
          <PhotoLoading>
            <LoadingIndicator tintColor="#FFFFFF" />
          </PhotoLoading>
        ) : (
          <PhotoContainer>
            <Photo
              source={{ uri: showOriginal ? image?.uri : editedImage?.uri }}
              flipX={showOriginal && flipX}
            ></Photo>
          </PhotoContainer>
        )}

        {/* <Surface width={480} height={300}>
          <Saturate contrast="1" saturation="1" brightness="1">
            https://i.imgur.com/uTP9Xfr.jpg
          </Saturate>
        </Surface> */}

        <Footer>
          {/* <FooterItem>
              <FooterAcessory onPress={() => navigation.goBack()}>
                <FooterAcessoryIcon name="close" />
              </FooterAcessory>
            </FooterItem> */}
          {/* <FooterItem>
              <FooterAcessory onPress={toggleType}>
                <FooterAcessoryIcon name="flip-2" />
              </FooterAcessory>
            </FooterItem> */}
        </Footer>
      </Container>
    </SafeAreaView>
  );
}
