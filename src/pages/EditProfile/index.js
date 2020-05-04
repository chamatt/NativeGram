import React, { useEffect, useState, useCallback } from "react";
import {
  Layout,
  Input,
  Button,
  Icon,
  Calendar,
  Datepicker,
  Text,
} from "@ui-kitten/components";

import {
  UserAvatar,
  AvatarOverlay,
  AvatarContainer,
  CameraEditIcon,
} from "./styles";
import { gql } from "apollo-boost";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreState, useStoreActions } from "easy-peasy";
import { useQuery, useMutation } from "@apollo/react-hooks";
import SizedBox from "~/components/SizedBox";
import LoadingIndicator, { LoadingPage } from "~/components/LoadingIndicator";
import { defaultAvatar } from "~/constants";
import { View } from "react-native";
import { parseISO, format } from "date-fns";
import { useEvaTheme } from "~/context/ThemeContext";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const UPDATE_PROFILE = gql`
  mutation updateProfile(
    $profileId: ID!
    $name: String
    $bio: String
    $birthdate: Date
  ) {
    updateProfile(
      input: {
        data: { bio: $bio, name: $name, birthdate: $birthdate }
        where: { id: $profileId }
      }
    ) {
      profile {
        id
        bio
        birthdate
        name
      }
    }
  }
`;

const CREATE_PROFILE = gql`
  mutation createProfile(
    $userId: ID!
    $name: String!
    $bio: String
    $birthdate: Date
  ) {
    createProfile(
      input: {
        data: { bio: $bio, name: $name, birthdate: $birthdate, user: $userId }
      }
    ) {
      profile {
        id
        bio
        birthdate
        name
      }
    }
  }
`;

const FETCH_PROFILE = gql`
  query fetchProfile($id: ID!) {
    user(id: $id) {
      id
      profile {
        id
        bio
        name
        birthdate
        avatar {
          id
          url
        }
      }
      posts {
        id
      }
    }
  }
`;

const useMyProfile = () => {
  const me = useStoreState((state) => state?.auth?.user?._id);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
    refetch: profileRefetch,
  } = useQuery(FETCH_PROFILE, {
    variables: { id: me },
  });

  // const [
  //   updateProfile,
  //   {
  //     data: updateProfileData,
  //     loading: updateProfileLoading,
  //     error: updateProfileError,
  //   },
  // ] = useMutation(UPDATE_PROFILE, {
  //   awaitRefetchQueries: true,
  //   refetchQueries: () => ["fetchProfile"],
  //   onCompleted: () => {
  //     navigation.pop();
  //   },
  // });
  // const [
  //   createProfile,
  //   {
  //     data: createProfileData,
  //     loading: createProfileLoading,
  //     error: createProfileError,
  //   },
  // ] = useMutation(CREATE_PROFILE, {
  //   awaitRefetchQueries: true,
  //   refetchQueries: () => ["fetchProfile"],
  //   onCompleted: () => {
  //     navigation.pop();
  //   },
  // });

  // useEffect(() => {
  //   if (updateProfileError) alert(updateProfileError);
  // }, [updateProfileError]);

  return {
    profile,
    profileLoading,
    profileRefetch,
  };
};

const now = new Date();

const tminus120 = new Date(
  now.getFullYear() - 120,
  now.getMonth(),
  now.getDate()
);
const tminus13 = new Date(
  now.getFullYear() - 13,
  now.getMonth(),
  now.getDate()
);

export default function EditProfile() {
  const { profile, profileLoading, profileRefetch } = useMyProfile();
  const me = useStoreState((state) => state?.auth?.user?._id);
  const navigation = useNavigation();
  const route = useRoute();
  const { themeType } = useEvaTheme();
  const [name, setName] = useState();
  const [bio, setBio] = useState();
  const [birthdate, setBirthdate] = React.useState(null);

  const { image, isLoading, loadingProgress } = useStoreState(
    (state) => state.editProfile
  );
  const { editProfile } = useStoreActions((actions) => actions.editProfile);

  const handleEditProfile = useCallback(() => {
    editProfile({
      userId: me,
      profileId: profile?.user?.profile?.id,
      name,
      bio,
      birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : null,
      image,
      navigation,
      refetch: profileRefetch,
    });
    // if (profile?.user?.profile) {
    //   updateProfile({
    //     variables: {
    //       profileId: profile?.user?.profile?.id,
    //       name,
    //       bio,
    //       birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : null,
    //     },
    //   });
    // } else {
    //   createProfile({
    //     variables: {
    //       name,
    //       bio,
    //       birthdate: birthdate ? format(birthdate, "yyyy-MM-dd") : null,
    //       userId: me,
    //     },
    //   });
    // }
  }, [profile, name, bio, birthdate, image]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          appearance="ghost"
          status="primary"
          disabled={isLoading}
          icon={(style) =>
            !isLoading ? (
              <Icon
                {...style}
                name={isLoading ? "checkmark" : "checkmark-outline"}
              />
            ) : (
              <LoadingIndicator {...style}></LoadingIndicator>
            )
          }
          onPress={handleEditProfile}
        ></Button>
      ),
    });
  }, [isLoading, profile, name, bio, birthdate, image]);

  useEffect(() => {
    setName(profile?.user?.profile?.name);
    setBio(profile?.user?.profile?.bio);
    if (profile?.user?.profile?.birthdate) {
      setBirthdate(parseISO(profile?.user?.profile?.birthdate));
    }
  }, [profile]);

  if (isLoading) {
    return <LoadingPage progress={loadingProgress} />;
  }
  if (profileLoading) return <LoadingPage />;

  return (
    <Layout level="2" style={{ flex: 1 }}>
      <KeyboardAwareScrollView>
        <Layout
          level="2"
          style={{ flex: 1, padding: 20, alignItems: "center" }}
        >
          <AvatarContainer>
            <UserAvatar
              size="giant"
              source={
                image
                  ? image
                  : profile?.user?.profile?.avatar?.url
                  ? { uri: profile?.user?.profile?.avatar?.url }
                  : defaultAvatar
              }
            ></UserAvatar>
            <AvatarOverlay
              onPress={() => navigation.push("EditProfile/Camera")}
            >
              <CameraEditIcon />
            </AvatarOverlay>
          </AvatarContainer>
          <SizedBox height={20} />
          <Input
            keyboardAppearance={themeType}
            style={{ width: "100%" }}
            label="Full Name"
            autoCapitalize="none"
            placeholder="Your Name"
            value={name}
            onChangeText={setName}
          />
          <SizedBox height={20} />
          <View style={{ width: "100%" }}>
            <Input
              keyboardAppearance={themeType}
              style={{ width: "100%" }}
              label="Biography"
              autoCapitalize="none"
              multiline
              maxLength={500}
              numberOfLines={4}
              placeholder="Write a small paragraph about you"
              size="large"
              style={{ minHeight: 100 }}
              value={bio}
              onChangeText={setBio}
              textAlignVertical="top"
            />
          </View>
          <SizedBox height={20} />
          <Datepicker
            keyboardAppearance={themeType}
            label="Birthdate"
            style={{ width: "100%" }}
            min={tminus120}
            max={tminus13}
            date={birthdate}
            onSelect={(nextDate) => setBirthdate(nextDate)}
          />
        </Layout>
      </KeyboardAwareScrollView>
    </Layout>
  );
}
