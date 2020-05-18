import React, { useState } from "react";
import { SafeAreaView, Dimensions, Image } from "react-native";
import { Layout, Text, Input, Icon, Button } from "@ui-kitten/components";
import { Container, LogoContainer, LogoText } from "./styles";
import SizedBox from "~/components/SizedBox";
import { useStoreActions, useStoreState } from "easy-peasy";
import LoadingIndicator from "~/components/LoadingIndicator";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Logo from "~/assets/img/logo.png";

const HEIGHT = Dimensions.get("screen").height;

export default function SignUp({ navigation }) {
  const [username, setUsername] = useState();
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();

  const signUp = useStoreActions((actions) => actions.auth.signUpRequest);
  const loading = useStoreState((state) => state.auth.loading);

  return (
    <Container level="2">
      <KeyboardAwareScrollView>
        <SizedBox height={HEIGHT / 15} />
        <LogoContainer>
          <Image source={Logo} style={{ width: 100, height: 100 }}></Image>
          <LogoText>Nativegram</LogoText>
        </LogoContainer>
        <SizedBox height={HEIGHT / 15} />
        <SafeAreaView>
          <Input
            autoCapitalize="none"
            label="Username"
            placeholder="johndoe"
            value={username}
            onChangeText={setUsername}
          />
          <SizedBox height={20} />
          <Input
            label="Email"
            autoCapitalize="none"
            keyboardType="email-address"
            placeholder="john.doe@example.com"
            value={email}
            onChangeText={setEmail}
          />
          <SizedBox height={20} />
          <Input
            label="Password"
            secureTextEntry
            placeholder="**************"
            value={password}
            onChangeText={setPassword}
          />
          <SizedBox height={40} />
          <Button
            icon={
              loading
                ? (style) => <LoadingIndicator {...style}></LoadingIndicator>
                : null
            }
            disabled={loading}
            appearance="filled"
            status="primary"
            onPress={() => signUp({ username, email, password })}
          >
            {!loading && "CREATE ACCOUNT"}
          </Button>
        </SafeAreaView>
      </KeyboardAwareScrollView>
    </Container>
  );
}
