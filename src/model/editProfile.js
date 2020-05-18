import { thunk, action } from "easy-peasy";
import { AsyncStorage, Alert } from "react-native";
import api from "~/services/api";
import { CommonActions } from "@react-navigation/native";

const INITIAL_STATE = {
  image: null,
  isLoading: false,
  loadingProgress: 0,
};

export default {
  ...INITIAL_STATE,

  editProfile: thunk(async (actions, payload, { getState }) => {
    const {
      userId,
      profileId,
      name,
      bio,
      birthdate,
      image,
      navigation,
      refetch,
    } = payload;
    actions.setIsLoading(true);
    const formData = new FormData();

    const data = { name, bio, birthdate };
    if (image) {
      formData.append(
        "files.avatar",
        {
          uri: image?.uri,
          type: "image/jpeg", // or photo.type
          name: `postImage`,
        },
        `postImage-_${Math.random().toString(36).substr(2, 9)}`
      );
    }

    const config = {
      onUploadProgress: function (progressEvent) {
        var percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        actions.setLoadingProgress(percentCompleted);
      },
    };

    try {
      let response;
      if (profileId) {
        formData.append("data", JSON.stringify(data));
        response = await api.put(`/profiles/${profileId}`, formData, config);
      } else {
        formData.append("data", JSON.stringify({ ...data, user: userId }));
        response = await api.post(`/profiles`, formData, config);
      }

      actions.setIsLoading(false);
      //   navigation.navigate(
      //     CommonActions.reset({
      //       index: 10,
      //       routes: [{ name: "UserProfile", params: { shouldReset: true } }],
      //     })
      //   );
      //   navigation.navigate("UserProfile", { shouldReset: true });
      refetch();
      navigation.pop();
      await actions.reset();
    } catch (err) {
      const message = err?.response?.data?.data?.[0]?.messages?.[0]?.message;
      Alert.alert(
        "Create Post Failed",
        message || "There was an error creating the post 😐"
      );
      actions.setIsLoading(false);
      await actions.reset();
    }
  }),
  setImage: action((state, payload) => {
    state.image = payload;
  }),
  setLoadingProgress: action((state, payload) => {
    state.loadingProgress = payload;
  }),
  setIsLoading: action((state, payload) => {
    state.isLoading = payload;
  }),
  reset: action((state, payload) => {
    state.images = null;
    state.isLoading = false;
    state.loadingProgress = 0;
  }),
};
