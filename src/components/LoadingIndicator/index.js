import React from "react";
import { ActivityIndicator } from "react-native";

const LoadingIndicator = props => (
  <ActivityIndicator {...props} color={props.tintColor} />
);

export default LoadingIndicator;
