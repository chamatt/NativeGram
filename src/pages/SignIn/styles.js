import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

export const Container = styled(Layout)`
  flex: 1;
  justify-content: center;
  padding: 20px;
`;

export const LogoContainer = styled.View`
  align-items: center;
`;
export const LogoText = styled.Text`
  font-size: 60px;
  padding-top: 20px;
  font-family: RichardMurray;
  color: ${(props) => props.theme["text-basic-color"]};
`;
