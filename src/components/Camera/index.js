import React, { useEffect, useState, useRef } from "react";
import { View, StatusBar, Platform, Modal, Image } from "react-native";

import {
  Container,
  Header,
  Footer,
  ExpoCamera,
  ExpoCameraPlaceholder,
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
import {
  useNavigation,
  useIsFocused,
  useFocusEffect,
} from "@react-navigation/native";
import { useEvaTheme } from "~/context/ThemeContext";
import PhotoEditor from "~/components/PhotoEditor";

import * as ImagePicker from "expo-image-picker";
import Constants from "expo-constants";
import * as Permissions from "expo-permissions";
import LoadingIndicator from "../LoadingIndicator";

// const DESIRED_RATIO = "16:9";

export default function Camera() {
  const navigation = useNavigation();
  const cameraRef = useRef();
  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(RNCamera.Constants.Type.front);
  const theme = useTheme();
  const { themeType } = useEvaTheme();
  const isFocused = useIsFocused();
  const [selectedImage, setSelectedImage] = useState(null);
  const [finalImage, setFinalImage] = useState(null);
  const [cameraReady, setCameraReady] = useState(false);
  const [loadingCapture, setLoadingCapture] = useState(false);
  const [photoEditorOpen, setPhotoEditorOpen] = useState(false);
  const [shouldFlipX, setShouldFlipX] = useState(false);

  useEffect(() => {
    (async () => {
      const { status } = await RNCamera.requestPermissionsAsync();
      setHasPermission(status === "granted");
      if (status !== "granted") {
        alert("Sorry, we need camera permissions!");
      }
    })();
  }, []);

  useEffect(() => {
    async () => {
      if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    };
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [3, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        setSelectedImage(result);
        setShouldFlipX(false);
        setPhotoEditorOpen(true);
      }
      console.log(selectedImage);
      console.log(result);
    } catch (err) {
      setPhotoEditorOpen(false);
      console.log("error", err);
    }
  };

  const takePicture = async () => {
    if (cameraRef) {
      setLoadingCapture(true);
      if (cameraReady) {
        try {
          setSelectedImage(null);
          let photo = await cameraRef.current.takePictureAsync({
            skipProcessing: true,
            onPictureSaved: async (image) => {
              setShouldFlipX(type === RNCamera.Constants.Type.front);
              setPhotoEditorOpen(true);
              setSelectedImage(image);
              setLoadingCapture(false);
              cameraRef.current.resumePreview();
            },
          });

          cameraRef.current.pausePreview();

          // console.warn(photo);
          // if (!photo.cancelled) {
          //   setSelectedImage(photo.uri);
          //   setLoadingCapture(false);
          //   cameraRef.current.resumePreview();
          // }
        } catch (err) {
          setLoadingCapture(false);
          setPhotoEditorOpen(false);

          cameraRef.current.resumePreview();
          console.log("error", err);
        }
      }

      // setLoadingCapture(false);
    } else {
      setLoadingCapture(false);
      console.warn("kadjfklad");
    }
  };

  const toggleType = () => {
    setType(
      type === RNCamera.Constants.Type.back
        ? RNCamera.Constants.Type.front
        : RNCamera.Constants.Type.back
    );
  };

  // Set Camera to "Not Ready" when route is not focused
  useFocusEffect(
    React.useCallback(() => {
      return () => setCameraReady(false);
    }, [])
  );

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

  return (
    <Container>
      <StatusBar
        backgroundColor={theme["background-basic-color-1"]}
        barStyle={themeType === "light" ? "dark-content" : "light-content"}
      />

      <Header>
        <GalleryButton
          onPress={() => {
            pickImage();
          }}
        >
          Gallery
        </GalleryButton>
      </Header>
      {isFocused ? (
        <ExpoCamera
          ratio="4:3"
          type={type}
          ref={cameraRef}
          // style={{ flex: 1 }}
          onCameraReady={() => setCameraReady(true)}
        ></ExpoCamera>
      ) : (
        <ExpoCameraPlaceholder />
      )}
      <Footer>
        <FooterItem>
          <FooterAcessory onPress={() => navigation.goBack()}>
            <FooterAcessoryIcon name="close" />
          </FooterAcessory>
        </FooterItem>
        <FooterItem>
          <CameraButton
            disabled={loadingCapture}
            loading={loadingCapture}
            onPress={() => {
              takePicture();
            }}
          >
            {loadingCapture ? (
              <LoadingIndicator />
            ) : (
              <CameraButtonIcon loading={loadingCapture} />
            )}
          </CameraButton>
        </FooterItem>
        <FooterItem>
          <FooterAcessory onPress={toggleType}>
            <FooterAcessoryIcon name="flip-2" />
          </FooterAcessory>
        </FooterItem>
      </Footer>

      <Modal
        animationType="fade"
        transparent={false}
        visible={photoEditorOpen}
        onRequestClose={() => setPhotoEditorOpen(false)}
      >
        <PhotoEditor
          flipX={shouldFlipX}
          onBack={() => setPhotoEditorOpen(false)}
          loading={loadingCapture}
          image={selectedImage}
        />
      </Modal>
    </Container>
  );
}
