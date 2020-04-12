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
  MediaLibraryItemContainer,
  MediaLibraryItem,
  MediaLibraryContainer,
  MediaLibraryScrollView,
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
import * as MediaLibrary from "expo-media-library";
import LoadingIndicator from "../LoadingIndicator";
import { ScrollView } from "react-native-gesture-handler";
import { SharedElement } from "react-navigation-shared-element";

// const DESIRED_RATIO = "16:9";

export default function Camera({ redirectTo }) {
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
  const [mediaLibrary, setMediaLibrary] = useState(null);

  useEffect(() => {
    (async () => {
      // const { status } = await RNCamera.requestPermissionsAsync();
      const { status } = await Permissions.askAsync(
        Permissions.CAMERA,
        Permissions.CAMERA_ROLL
      );
      // if (status !== "granted") {
      //   alert("Sorry, we need camera roll permissions to make this work!");
      // }
      setHasPermission(status === "granted");
      if (status !== "granted") {
        alert("Sorry, we need camera permissions!");
      }
    })();
  }, []);

  useEffect(() => {
    async () => {
      // if (Constants.platform.ios) {
      // }
    };
  }, []);

  const pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        // aspect: [3, 4],
        quality: 1,
      });
      if (!result.cancelled) {
        // setSelectedImage(result);
        // setShouldFlipX(false);
        navigation.navigate(redirectTo, { image: result, flipX: false });
      }
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
              setSelectedImage(image);
              setLoadingCapture(false);
              navigation.navigate(redirectTo, {
                image: image,
                flipX: type === RNCamera.Constants.Type.front,
              });
              cameraRef.current.resumePreview();
            },
          });

          cameraRef.current.pausePreview();
        } catch (err) {
          setLoadingCapture(false);
          setPhotoEditorOpen(false);
          cameraRef.current.resumePreview();
          console.log("error", err);
        }
      }

      setLoadingCapture(false);
    } else {
      setLoadingCapture(false);
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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: () => (
        <Header>
          <GalleryButton
            onPress={() => {
              pickImage();
            }}
          >
            Gallery
          </GalleryButton>
        </Header>
      ),
    });
  });

  async function fetchLibrary(endCursor) {
    if (hasPermission) {
      const assets = await MediaLibrary.getAssetsAsync({
        first: 10,
        after: endCursor ? endCursor : null,
        sortBy: [MediaLibrary.SortBy.creationTime],
      });
      if (endCursor && mediaLibrary) {
        setMediaLibrary({
          ...assets,
          assets: [...mediaLibrary.assets, ...assets.assets],
        });
      }
      if (!endCursor && !mediaLibrary) {
        setMediaLibrary(assets);
      }
    }
  }

  useEffect(() => {
    fetchLibrary();
  }, [hasPermission]);

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

      {isFocused ? (
        <Layout
          style={{
            height: 400,
            overflow: "hidden",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ExpoCamera
            ratio="4:3"
            type={type}
            ref={cameraRef}
            // style={{ flex: 1 }}
            onCameraReady={() => setCameraReady(true)}
          ></ExpoCamera>
        </Layout>
      ) : (
        <ExpoCameraPlaceholder />
      )}
      <MediaLibraryContainer>
        <MediaLibraryScrollView
          data={mediaLibrary?.assets}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            return (
              <SharedElement id={`createPost.${item?.uri}.photo`}>
                <MediaLibraryItemContainer
                  onPress={() =>
                    navigation.push(redirectTo, {
                      image: item,
                      flipX: false,
                    })
                  }
                >
                  <MediaLibraryItem source={{ uri: item?.uri }} />
                </MediaLibraryItemContainer>
              </SharedElement>
            );
          }}
          onEndReachedThreshold={0.5}
          onEndReached={() => {
            if (mediaLibrary?.hasNextPage) {
              fetchLibrary(mediaLibrary?.endCursor);
            }
          }}
        ></MediaLibraryScrollView>
      </MediaLibraryContainer>

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
    </Container>
  );
}
