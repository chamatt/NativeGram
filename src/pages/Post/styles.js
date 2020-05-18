import styled from "styled-components/native";
import { Layout } from "@ui-kitten/components";

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const Container = styled(Layout).attrs({ level: "3" })`
  align-items: center;
  /* padding: 20px; */
`;

export const Body = styled(Layout)`
  padding: 20px;
`;
