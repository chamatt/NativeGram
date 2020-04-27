import React from "react";
import { List } from "@ui-kitten/components";
import UserItem from "../UserItem";
import { RefreshControl } from "react-native";
import { Container } from "./styles";

export default function FollowList({ users, refreshing, onRefresh, ...rest }) {
  return (
    <Container>
      <List
        data={users}
        renderItem={({
          item: { id, image, name, slug, following, onFollow },
        }) => {
          return (
            <UserItem
              id={id}
              image={image}
              name={name}
              slug={slug}
              following={following}
              onFollow={onFollow}
            />
          );
        }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        {...rest}
      ></List>
    </Container>
  );
}
