import React, { useState, useEffect } from "react";
import { View } from "react-native";
import { Input, Layout, Text, Icon, useTheme } from "@ui-kitten/components";
import { SafeAreaView } from "~/components/SafeArea";

import { Header, Body } from "./styles";
import SizedBox from "~/components/SizedBox";
import FollowList from "~/components/FollowList";
import posed, { Transition } from "react-native-pose";

const SearchIcon = (style, theme) => (
  <Icon
    {...style}
    tintColor={theme["text-basic-color"]}
    name="search-outline"
  />
);
const ClearIcon = (style, theme) => (
  <Icon {...style} tintColor={theme["text-basic-color"]} name="close-outline" />
);

const Box = posed.View({
  enter: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -50 },
});

const useInputChanges = (initialValue = "") => {
  const [value, setValue] = React.useState(initialValue);
  return {
    value,
    onChangeText: setValue,
    setValue,
  };
};

export default function Explore() {
  const theme = useTheme();
  const [showTitle, setShowTitle] = useState(true);
  const searchControl = useInputChanges("");

  return (
    <Layout style={{ flex: 1 }}>
      <SafeAreaView>
        <Header active={!showTitle}>
          {showTitle && (
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
          )}
          <Input
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
              if (!searchControl?.value?.length) setShowTitle(true);
            }}
            onIconPress={() => {
              setShowTitle(true);
              searchControl.setValue("");
            }}
            icon={(styles) =>
              searchControl?.value?.length
                ? ClearIcon(styles, theme)
                : SearchIcon(styles, theme)
            }
            {...searchControl}
          />
        </Header>
        <Body>
          <FollowList
            refreshing={false}
            users={[
              { slug: "chamatt", name: "Matheus" },
              { slug: "chamatt", name: "Matheus" },
              { slug: "chamatt", name: "Matheus" },
            ]}
          />
        </Body>
      </SafeAreaView>
    </Layout>
  );
}
