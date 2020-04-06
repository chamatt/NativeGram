import styled from "styled-components/native";
import { Icon } from "@ui-kitten/components";

export const Container = styled.View`
  flex-direction: row;
  align-items: center;
`;

export const HeartIcon = styled(Icon).attrs((props) => ({
  name: props.active ? "heart" : "heart-outline",
  width: 16,
  height: 16,
}))`
  color: white;
`;
export const MessageIcon = styled(Icon).attrs((props) => ({
  name: props.active ? "message-square" : "message-square-outline",
  width: 16,
  height: 16,
}))`
  color: white;
`;
