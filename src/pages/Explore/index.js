import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Input, Layout, Text, Icon, useTheme } from "@ui-kitten/components";
import { SafeAreaView } from "~/components/SafeArea";

import { Header, Body, PosedView, Box, SearchIcon, ClearIcon } from "./styles";
import SizedBox from "~/components/SizedBox";
import FollowList from "~/components/FollowList";
import posed, { Transition } from "react-native-pose";
import { gql } from "apollo-boost";
import useDebounce from "~/hooks/useDebounce";
import { useQuery } from "@apollo/react-hooks";

const transformDataIntoUsers = (list) => {
  return list?.map((item) => {
    const imageUri = item?.profile?.avatar?.url
      ? { uri: item?.profile?.avatar?.url }
      : null;

    return {
      id: item?.id,
      slug: item?.username,
      name: item?.profile?.name,
      image: imageUri,
    };
  });
};

const SEARCH_USERS = gql`
  query searchUsers($term: String!) {
    users(limit: 5, where: { username_contains: $term }) {
      id
      username
      profile {
        name
        avatar {
          url
        }
      }
    }
  }
`;

const useInputChanges = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return {
    value,
    onChangeText: setValue,
    setValue,
  };
};

const useSearch = (term) => {
  const [value, setValue] = useState();
  const [users, setUsers] = useState([]);
  const debouncedSearchTerm = useDebounce(value, 500);

  const { data, loading, error } = useQuery(SEARCH_USERS, {
    variables: { term: debouncedSearchTerm },
    skip: !debouncedSearchTerm,
  });
  useEffect(() => {
    setUsers(transformDataIntoUsers(data?.users || []));
  }, [data]);

  return { data, users, loading, error, value, setValue };
};

export default function Explore() {
  const theme = useTheme();
  const [showTitle, setShowTitle] = useState(true);
  const { data, users, loading, error, value, setValue } = useSearch();

  return (
    <Layout style={{ flex: 1 }}>
      <PosedView style={{ flex: 1 }} pose={showTitle ? "closed" : "opened"}>
        <SafeAreaView>
          <Header active={!showTitle}>
            {/* {showTitle && ( */}
            <Box
              key="showTitle"
              style={{ height: 50 }}
              key="searchTitle"
              pose={showTitle ? "enter" : "exit"}
              onAnimate
            >
              <>
                <Text category="h3" style={{ fontWeight: "bold" }}>
                  Search
                </Text>
                <SizedBox height={10} />
              </>
            </Box>
            <Input
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Search for someone..."
              placeholderTextColor={theme["text-hint-color"]}
              text
              autoFocus
              key="searchInput"
              textStyle={{ color: theme["text-basic-color"] }}
              iconStyle={{ color: theme["text-basic-color"] }}
              style={{
                borderColor: theme["text-basic-color"],
                backgroundColor: null,
              }}
              status="control"
              onFocus={() => setShowTitle(false)}
              onBlur={() => {
                if (!value?.length) setShowTitle(true);
              }}
              onIconPress={() => {
                setShowTitle(true);
                setValue("");
              }}
              icon={(styles) =>
                value?.length
                  ? ClearIcon(styles, theme)
                  : SearchIcon(styles, theme)
              }
              value={value}
              onChangeText={setValue}
            />
          </Header>
          <Body>
            <FollowList refreshing={false} users={users} />
          </Body>
        </SafeAreaView>
      </PosedView>
    </Layout>
  );
}
