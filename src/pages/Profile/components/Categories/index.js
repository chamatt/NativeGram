import React from "react";

import {
  CategoryContainer,
  CategoryItem,
  CategoryTitle,
  CategoryCount,
} from "./styles";

export default function Categories({ posts, followers, following }) {
  return (
    <CategoryContainer>
      <CategoryItem>
        <CategoryCount>{posts || 0}</CategoryCount>
        <CategoryTitle>Posts</CategoryTitle>
      </CategoryItem>
      <CategoryItem>
        <CategoryCount>{followers || 0}</CategoryCount>
        <CategoryTitle>Followers</CategoryTitle>
      </CategoryItem>
      <CategoryItem>
        <CategoryCount>{following || 0}</CategoryCount>
        <CategoryTitle>Following</CategoryTitle>
      </CategoryItem>
    </CategoryContainer>
  );
}
