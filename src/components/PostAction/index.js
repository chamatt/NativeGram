import React from "react";

import { Container, HeartIcon, MessageIcon } from "./styles";
import { Text, Button } from "@ui-kitten/components";

export default function PostLikes({
  amount = 0,
  active = false,
  onPress = () => {},
  type = "like",
}) {
  const IconType =
    {
      like: HeartIcon,
      comment: MessageIcon,
    }[type] || HeartIcon;

  const status =
    {
      like: "danger",
      comment: "info",
    }[type] || "danger";

  return (
    <Button
      style={{ justifyContent: "flex-start" }}
      size="small"
      appearance="ghost"
      status={status}
      icon={(style) => <IconType {...style} active={active} />}
      onPress={onPress}
    >
      {amount.toString()}
    </Button>
  );
}
