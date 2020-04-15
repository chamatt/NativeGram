import React, { useEffect, useState } from "react";
import { View, Image, Alert, KeyboardAvoidingView } from "react-native";
import Camera from "~/components/Camera";
import { useStoreState, useStoreActions } from "easy-peasy";
import {
  Layout,
  Button,
  Input,
  Text,
  MenuItem,
  OverflowMenu,
} from "@ui-kitten/components";
import {
  ImageContainer,
  ImageItem,
  ImagesScrollView,
  ImageNewIcon,
  ImageNew,
} from "./styles";
import { useNavigation } from "@react-navigation/native";
import { CommonActions } from "@react-navigation/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { SharedElement } from "react-navigation-shared-element";
import { useEvaTheme } from "~/context/ThemeContext";
import client from "~/graphql";
import { gql } from "apollo-boost";
import { ReactNativeFile } from "apollo-upload-client";
import api from "~/services/api";
import { LoadingPage } from "~/components/LoadingIndicator";

const MULTIPLE_UPLOAD = gql`
  mutation($files: [Upload!]!) {
    multipleUpload(files: $files) {
      id
      url
    }
  }
`;

export default function CreatePostScreen() {
  const me = useStoreState((state) => state?.auth?.user?._id);
  const navigation = useNavigation();
  const images = useStoreState((state) => state.createPost.images);
  const newImage = useStoreActions((actions) => actions.createPost.newImage);
  const reset = useStoreActions((actions) => actions.createPost.reset);
  const [loading, setLoading] = useState(false);
  const setCurrent = useStoreActions(
    (actions) => actions.createPost.setCurrent
  );

  const { themeType } = useEvaTheme();

  const [description, setDescription] = useState("");
  const [overflowMenuIndex, setOverflowMenuIndex] = useState(null);
  const [loadingProgress, setLoadingProgress] = useState(0);

  function handleNewImage() {
    if (images.length < 5) {
      newImage();
      navigation.push("CreatePost/Camera");
    } else {
      Alert.alert("Image limit exceeded", "You can only add up to 5 pictures");
    }
  }

  function handleEditImage(index) {
    setCurrent(index);
    navigation.push("CreatePost/Editor", { image: images[index] });
  }

  function discardPost() {
    reset();
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: "FeedStack" }],
      })
    );
  }
  function discardPostAlert() {
    Alert.alert("Discard Post?", "You are gonna lose all the current work", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      { text: "Discard", onPress: () => discardPost(), style: "destructive" },
    ]);
  }
  async function savePost() {
    if (loading) return;
    setLoading(true);
    if (!images?.length) {
      setLoading(false);
      return Alert.alert("Add an image", "Your post needs at least one image");
    } else if (description.length < 3) {
      setLoading(false);
      return Alert.alert(
        "Add a description",
        "Your description needs to be at least 3 characters long"
      );
    }

    const data = {
      description,
      user: me,
    };

    const formData = new FormData();

    images.forEach((photo, i) => {
      formData.append(
        "files.images",
        {
          uri: photo.uri,
          type: "image/jpeg", // or photo.type
          name: `postImage-${i}`,
        },
        `postImage-_${Math.random().toString(36).substr(2, 9)}`
      );
    });

    formData.append("data", JSON.stringify(data));

    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        setLoadingProgress(percentCompleted);
      },
    };

    try {
      const response = await api.post("/posts", formData, config);
      setLoading(false);
      await reset();
      navigation.dispatch(
        CommonActions.reset({
          index: 10,
          routes: [{ name: "UserProfile", paramas: { shouldReset: true } }],
        })
      );
    } catch (err) {
      const message = err?.response?.data?.data?.[0]?.messages?.[0]?.message;
      Alert.alert(
        "Create Post Failed",
        message || "There was an error creating the post 😐"
      );
      setLoading(false);
    }
  }

  async function uploadFiles(files) {
    // const rnFiles = files.map((item, i) => {
    //   return new ReactNativeFile({
    //     uri: item.uri,
    //     name: `${i}.jpg`,
    //     type: "image/jpeg",
    //   });
    // });

    const uploads = await client.mutate({
      mutation: MULTIPLE_UPLOAD,
      variables: { files: rnFiles },
    });
    return uploads;
  }

  useEffect(() => {
    navigation.setOptions({
      headerTitleAlign: "center",
      headerLeft: () => (
        <Button appearance="ghost" status="danger" onPress={discardPostAlert}>
          Discard
        </Button>
      ),
      headerRight: () => (
        <Button
          disabled={loading}
          appearance="ghost"
          status="primary"
          onPress={savePost}
        >
          Post
        </Button>
      ),
    });
  }, [images, description, loading]);

  if (loading) {
    return <LoadingPage progress={loadingProgress} />;
  }

  console.log("images", images);

  return (
    <Layout style={{ flex: 1 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <Layout>
          <ImagesScrollView>
            {images?.map((img, i) => {
              return (
                <ImageContainer key={i} onPress={() => handleEditImage(i)}>
                  <SharedElement
                    key={img?.uri}
                    id={`createPost.${img?.uri}.photo`}
                  >
                    <ImageItem source={{ uri: img?.uri }} />
                  </SharedElement>
                </ImageContainer>
              );
            })}
            <ImageContainer onPress={handleNewImage}>
              <ImageNew>
                <ImageNewIcon />
              </ImageNew>
            </ImageContainer>
          </ImagesScrollView>
        </Layout>
        <Layout style={{ padding: 20, paddingBottom: 0 }}>
          <Text category="h5">Description</Text>
        </Layout>
        <Layout style={{ flex: 1, padding: 20 }}>
          <Input
            textAlignVertical="top"
            keyboardAppearance={themeType}
            style={{ width: "100%" }}
            autoCapitalize="sentences"
            placeholder="Post Description"
            size="large"
            multiline
            numberOfLines={4}
            textStyle={{ height: 150 }}
            value={description}
            onChangeText={setDescription}
          />
        </Layout>
      </KeyboardAwareScrollView>
    </Layout>
  );
}
