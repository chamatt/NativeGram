import styled from "styled-components/native";
import { Layout, Text } from "@ui-kitten/components";

export const Container = styled.View`
  width: 100%;
  padding-bottom: 10px;
`;

export const Header = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 2px;
`;
export const Author = styled(Text).attrs({ category: "s2" })``;
export const Body = styled(Text).attrs({ category: "p2" })`
  padding-left: 35px;
`;

export const Footer = styled(Text).attrs({
  category: "c1",
})`
  color: ${(props) => props.theme["text-hint-color"]};
  padding-left: 35px;
`;
export const AuthorContainer = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: flex-start;
`;
export const Right = styled.View`
  flex-direction: row;
  justify-content: flex-end;
`;
