import React from "react";

import {
  CategoryContainer,
  CategoryItem,
  CategoryTitle,
  CategoryCount,
} from "./styles";
import { useNavigation } from "@react-navigation/native";

export default function Categories({ userId, posts, followers, followings }) {
  const navigation = useNavigation();
  return (
    <CategoryContainer>
      <CategoryItem>
        <CategoryCount>{posts || 0}</CategoryCount>
        <CategoryTitle>Posts</CategoryTitle>
      </CategoryItem>
      <CategoryItem
        onPress={() =>
          navigation.push("Follow", { screen: "Follow/Followers", userId })
        }
      >
        <CategoryCount>{followers || 0}</CategoryCount>
        <CategoryTitle>Followers</CategoryTitle>
      </CategoryItem>
      <CategoryItem
        onPress={() =>
          navigation.push("Follow", { screen: "Follow/Following", userId })
        }
      >
        <CategoryCount>{followings || 0}</CategoryCount>
        <CategoryTitle>Following</CategoryTitle>
      </CategoryItem>
    </CategoryContainer>
  );
}
