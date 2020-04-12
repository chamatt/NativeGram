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

// import { Container } from './styles';

export default function CreatePostScreen() {
  const navigation = useNavigation();
  const images = useStoreState((state) => state.createPost.images);
  const newImage = useStoreActions((actions) => actions.createPost.newImage);
  const reset = useStoreActions((actions) => actions.createPost.reset);
  const setCurrent = useStoreActions(
    (actions) => actions.createPost.setCurrent
  );

  const { themeType } = useEvaTheme();

  const [description, setDescription] = useState("");
  const [overflowMenuIndex, setOverflowMenuIndex] = useState(null);

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
        routes: [{ name: "Home" }],
      })
    );
  }
  function discardPostAlert() {
    Alert.alert("Discard Post?", "You are gonna lose all the current work", [
      { text: "Cancel", onPress: () => {}, style: "cancel" },
      { text: "Discard", onPress: () => discardPost(), style: "destructive" },
    ]);
  }
  function savePost() {
    if (!images?.length) {
      Alert.alert("Add an image", "Your post needs at least one image");
    } else if (description.length < 3) {
      Alert.alert(
        "Add a description",
        "Your description needs to be at least 3 characters long"
      );
    }
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
        <Button appearance="ghost" status="primary" onPress={savePost}>
          Post
        </Button>
      ),
    });
  });

  return (
    <Layout style={{ flex: 1 }}>
      <KeyboardAwareScrollView style={{ flex: 1 }}>
        <Layout>
          <ImagesScrollView>
            {images.map((img, i) => {
              return (
                <ImageContainer onPress={() => handleEditImage(i)}>
                  <SharedElement
                    key={img.uri}
                    id={`createPost.${img.uri}.photo`}
                  >
                    <ImageItem source={{ uri: img.uri }} />
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
