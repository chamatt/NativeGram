import React, { useState, useEffect } from "react";
import {
  ApplicationProvider,
  Layout,
  Text,
  IconRegistry,
  useTheme,
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Routes from "~/routes";
import { StoreProvider } from "easy-peasy";
import { store, persistor } from "~/model";
import client from "~/graphql";
import { ApolloProvider } from "@apollo/react-hooks";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "styled-components";
import { useEvaTheme, ThemeContextProvider } from "~/context/ThemeContext";
import { StatusBar, View, Image } from "react-native";
import * as Font from "expo-font";
import { AppLoading, SplashScreen } from "expo";
import { Asset } from "expo-asset";

const App = () => {
  const { themeType } = useEvaTheme();

  const theme = useTheme();
  const [isAppReady, setIsAppReady] = useState(false);
  const [isSplashReady, setIsSplashReady] = useState(false);

  const _cacheSplashResourcesAsync = async () => {
    const gif = require("~/assets/img/logo.png");
    return Asset.fromModule(gif).downloadAsync();
  };

  const _cacheResourcesAsync = async () => {
    SplashScreen.hide();
    await Font.loadAsync({
      RichardMurray: require("~/assets/fonts/RichardMurray/RichardMurray.ttf"),
    });

    const images = [
      require("~/assets/img/gummy-powerbook.png"),
      require("~/assets/img/default-user-img.jpg"),
      require("~/assets/img/logo.png"),
      require("~/assets/img/default-user.png"),
    ];

    const cacheImages = images.map((image) => {
      return Asset.fromModule(image).downloadAsync();
    });

    await Promise.all(cacheImages);
    setIsAppReady(true);
  };

  if (!isSplashReady) {
    return (
      <AppLoading
        startAsync={_cacheSplashResourcesAsync}
        onFinish={() => setIsSplashReady(true)}
        onError={console.warn}
        autoHideSplash={false}
      />
    );
  }
  if (!isAppReady) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme["background-basic-color-1"],
        }}
      >
        <Image
          style={{ width: 100, height: 100 }}
          source={require("~/assets/img/logo.png")}
          onLoad={_cacheResourcesAsync}
        />
      </View>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <StatusBar
        backgroundColor={theme["background-basic-color-1"]}
        barStyle={themeType === "light" ? "dark-content" : "light-content"}
      />
      <Layout style={{ flex: 1 }}>
        <Routes />
      </Layout>
    </ThemeProvider>
  );
};

const AppProvider = () => {
  const evaTheme = useEvaTheme();

  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={evaTheme.currentTheme}>
        <App />
      </ApplicationProvider>
    </>
  );
};

export default () => {
  return (
    <ApolloProvider client={client}>
      <StoreProvider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <ThemeContextProvider>
            <AppProvider />
          </ThemeContextProvider>
        </PersistGate>
      </StoreProvider>
    </ApolloProvider>
  );
};
