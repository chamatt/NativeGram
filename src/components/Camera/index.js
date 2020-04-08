import React, { useEffect, useState, useRef } from "react";
import { View, StatusBar, Platform } from "react-native";

import {
  Container,
  Header,
  Footer,
  ExpoCamera,
  CameraButton,
  CameraButtonIcon,
  FooterItem,
  FooterAcessory,
  FooterAcessoryIcon,
  GalleryButton,
} from "./styles";
import { SafeAreaView, TopSafeArea } from "../SafeArea";
import { Button, Layout, Text, Icon, useTheme } from "@ui-kitten/components";
import { Camera as RNCamera } from "expo-camera";
import { useNavigation } from "@react-navigation/native";
import { useEvaTheme } from "~/context/ThemeContext";
// const DESIRED_RATIO = "16:9";

export default function Camera() {
  const navigation = useNavigation();
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const theme = useTheme();
  const { themeType } = useEvaTheme();

  useEffect(() => {
    (async () => {
      const { status } = await RNCamera.requestPermissionsAsync();
      setHasPermission(status === "granted");
    })();
  }, []);

  if (hasPermission === null) {
    return <Layout />;
  } else if (hasPermission === false) {
    return (
      <Layout
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <Text category="h1">Access Denied</Text>
      </Layout>
    );
  }

  const toggleType = () => {
    setType(
      type === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };
  //   const prepareRatio = async () => {
  //     if (Platform.OS === "android" && this.cam) {
  //       const ratios = await this.cam.getSupportedRatiosAsync();

  //       // See if the current device has your desired ratio, otherwise get the maximum supported one
  //       // Usually the last element of "ratios" is the maximum supported ratio
  //       const ratio =
  //         ratios.find((ratio) => ratio === DESIRED_RATIO) ||
  //         ratios[ratios.length - 1];

  //       this.setState({ ratio });
  //     }
  //   };

  return (
    <Container>
      <StatusBar
        backgroundColor={theme["background-basic-color-1"]}
        barStyle={themeType === "light" ? "dark-content" : "light-content"}
      />
      <Header>
        <GalleryButton onPress={() => {}}>Gallery</GalleryButton>
      </Header>
      <ExpoCamera
        ratio="4:3"
        type={type}
        ref={cameraRef}
        // style={{ flex: 1 }}
        // onCameraReady={prepareRatio}
      ></ExpoCamera>
      <Footer>
        <FooterItem>
          <FooterAcessory onPress={() => navigation.goBack()}>
            <FooterAcessoryIcon name="close" />
          </FooterAcessory>
        </FooterItem>
        <FooterItem>
          <CameraButton>
            <CameraButtonIcon />
          </CameraButton>
        </FooterItem>
        <FooterItem>
          <FooterAcessory onPress={toggleType}>
            <FooterAcessoryIcon name="flip-2" />
          </FooterAcessory>
        </FooterItem>
      </Footer>
    </Container>
  );
}
