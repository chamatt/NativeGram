import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Container = styled(Layout)`
  align-items: center;
  flex: 1;
  width: 100%;
`;

export const Body = styled(Layout)`
  padding: 0px 20px;
  padding-bottom: 20px;
  border-radius: ${wp("3%")}px;
  /* flex: 1; */
`;
