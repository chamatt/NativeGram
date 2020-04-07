import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Container = styled(Layout).attrs({ level: "3" })`
  align-items: center;
  /* padding-left: 20px;
  padding-right: 20px;
  padding-bottom: 10px; */
  flex: 1;
`;

export const Body = styled(Layout)`
  padding: 0px 20px;
  padding-bottom: 20px;
  border-radius: ${wp("3%")}px;
`;
