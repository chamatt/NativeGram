import styled from "styled-components/native";
import { SafeAreaView as TSafeAreaView } from "react-native";

export const Container = styled.View``;

export const TopSafeArea = styled(TSafeAreaView)`
  flex: 0;
  ${props =>
    props.backgroundColor && `background-color: ${props.backgroundColor}`};
`;
export const SafeAreaView = styled(TSafeAreaView)`
  flex: 1;
  ${props =>
    props.backgroundColor && `background-color: ${props.backgroundColor}`};
`;
export const BottomSafeArea = styled(TSafeAreaView)`
  flex: 0;
  ${props =>
    props.backgroundColor && `background-color: ${props.backgroundColor}`};
`;
