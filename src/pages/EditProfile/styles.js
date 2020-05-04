import styled from "styled-components/native";
import { Avatar, Icon } from "@ui-kitten/components";

export const UserAvatar = styled(Avatar)`
  width: 100px;
  height: 100px;
`;

export const AvatarContainer = styled.View`
  align-self: center;
  width: 100px;
  height: 100px;
  justify-content: center;
  align-items: center;
  position: relative;
`;

export const AvatarOverlay = styled.TouchableOpacity`
  width: 100px;
  height: 100px;
  border-radius: 50px;
  background: #3336;
  position: absolute;
  justify-content: center;
  align-items: center;
  margin-left: auto;
  margin-right: auto;
  left: 0;
  right: 0;
  text-align: center;
`;

export const CameraEditIcon = styled(Icon).attrs({
  name: "camera-outline",
  tintColor: "#fff",
})`
  width: 30px;
  height: 30px;
`;
