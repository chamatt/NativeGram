import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme, Layout, Text } from "@ui-kitten/components";

export const LoadingPage = ({ level = "2", color, progress }) => {
  return (
    <Layout
      level={level}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <LoadingIndicator tintColor={color} />
      {progress !== null && <Text category="s1">{progress}%</Text>}
    </Layout>
  );
};

const LoadingIndicator = (props) => {
  const theme = useTheme();
  return (
    <ActivityIndicator
      {...props}
      color={props?.tintColor || theme["text-basic-color"]}
    />
  );
};

export default LoadingIndicator;
