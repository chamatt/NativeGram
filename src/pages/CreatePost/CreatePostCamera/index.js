import React from "react";
import { View } from "react-native";
import Camera from "~/components/Camera";

// import { Container } from './styles';

export default function CreatePostCamera() {
  return <Camera redirectTo="CreatePost/Editor" />;
}
