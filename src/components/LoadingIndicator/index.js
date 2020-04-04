import React from "react";
import { ActivityIndicator } from "react-native";
import { useTheme, Layout } from "@ui-kitten/components";

export const LoadingPage = ({ level = "2", color }) => {
  return (
    <Layout
      level={level}
      style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
    >
      <LoadingIndicator tintColor={color} />
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
