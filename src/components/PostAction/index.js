import React from "react";

import { Container, HeartIcon, MessageIcon } from "./styles";
import { Text, Button, useTheme } from "@ui-kitten/components";
import LoadingIndicator from "../LoadingIndicator";

export default function PostLikes({
  amount = 0,
  active = false,
  onPress = () => {},
  type = "like",
  loading = false,
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

  const theme = useTheme();
  return (
    <Button
      style={{ justifyContent: "flex-start" }}
      size="small"
      appearance="ghost"
      status={status}
      icon={(style) =>
        loading ? (
          <LoadingIndicator
            size="small"
            tintColor={theme[`text-${status}-color`]}
          />
        ) : (
          <IconType {...style} active={active} />
        )
      }
      onPress={onPress}
    >
      {amount.toString()}
    </Button>
  );
}
