import React, { useEffect, useState, useCallback } from "react";
import { Layout, Input, Button, Icon } from "@ui-kitten/components";

import { UserAvatar } from "./styles";
import { gql } from "apollo-boost";
import { useNavigation, useRoute } from "@react-navigation/native";
import { useStoreState } from "easy-peasy";
import { useQuery, useMutation } from "@apollo/react-hooks";
import SizedBox from "~/components/SizedBox";
import LoadingIndicator from "~/components/LoadingIndicator";

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
      profile {
        id
        bio
        name
        avatar {
          url
        }
      }
      posts {
        id
      }
      Followers {
        id
      }
    }
  }
`;

const useMyProfile = () => {
  const me = useStoreState((state) => state.auth.user._id);
  const navigation = useNavigation();
  const route = useRoute();
  const {
    data: profile,
    loading: profileLoading,
    error: profileError,
  } = useQuery(FETCH_PROFILE, {
    variables: { id: me },
  });

  const [
    updateProfile,
    {
      data: updateProfileData,
      loading: updateProfileLoading,
      error: updateProfileError,
    },
  ] = useMutation(UPDATE_PROFILE, {
    awaitRefetchQueries: true,
    refetchQueries: () => ["fetchProfile"],
    onCompleted: () => {
      navigation.pop();
    },
  });

  useEffect(() => {
    if (updateProfileError) alert(updateProfileError);
  }, [updateProfileError]);

  return {
    profile,
    profileLoading,
    profileError,
    updateProfile,
    updateProfileLoading,
    updateProfileError,
    updateProfileData,
  };
};

export default function EditProfile() {
  const {
    profile,
    profileLoading,
    profileError,
    updateProfile,
    updateProfileLoading,
    updateProfileError,
    updateProfileData,
  } = useMyProfile();
  const navigation = useNavigation();
  const route = useRoute();
  const [name, setName] = useState();
  const [bio, setBio] = useState();

  const handleEditProfile = useCallback(() => {
    updateProfile({
      variables: {
        profileId: profile?.user?.profile?.id,
        name,
        bio,
      },
    });
  }, [profile, name, bio]);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          appearance="ghost"
          status="primary"
          disabled={updateProfileLoading}
          icon={(style) =>
            !updateProfileLoading ? (
              <Icon
                {...style}
                name={updateProfileLoading ? "checkmark" : "checkmark-outline"}
              />
            ) : (
              <LoadingIndicator {...style}></LoadingIndicator>
            )
          }
          onPress={handleEditProfile}
        ></Button>
      ),
    });
  }, [updateProfileLoading, profile, name, bio]);

  useEffect(() => {
    setName(profile?.user?.profile?.name);
    setBio(profile?.user?.profile?.bio);
  }, [profile]);

  return (
    <Layout level="2" style={{ flex: 1, padding: 20, alignItems: "center" }}>
      <UserAvatar
        size="giant"
        source={{ uri: profile?.user?.profile?.avatar?.url }}
      />
      <SizedBox height={20} />
      <Input
        label="Full Name"
        autoCapitalize="none"
        placeholder="Your Name"
        value={name}
        onChangeText={setName}
      />

      <SizedBox height={20} />
      <Input
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
      />
    </Layout>
  );
}
