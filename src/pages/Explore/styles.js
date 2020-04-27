import styled from "styled-components/native";

import { Input, Layout, Text } from "@ui-kitten/components";

export const Header = styled(Layout)`
  padding: 20px;
  padding-bottom: 0px;

  ${(props) =>
    props.active &&
    `
  padding: 10px;
  `}
`;
export const Body = styled(Layout)`
  padding-top: 0px;
  padding: 10px;
  flex: 1;
`;
