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
import { StatusBar, View } from "react-native";
import * as Font from "expo-font";

const App = () => {
  // const [theme, setTheme] = React.useState("light");
  // const currentTheme = themes[theme];

  // const toggleTheme = () => {
  //   const nextTheme = theme === "light" ? "dark" : "light";
  //   setTheme(nextTheme);
  // };
  const { themeType } = useEvaTheme();

  const theme = useTheme();

  const [loadingFonts, setLoadingFonts] = useState(true);
  useEffect(() => {
    const fetchFonts = async () => {
      await Font.loadAsync({
        RichardMurray: require("./assets/fonts/RichardMurray/RichardMurray.ttf"),
      });
      setLoadingFonts(false);
    };
    fetchFonts();
  }, []);

  if (loadingFonts) {
    return <Layout style={{ flex: 1 }} />;
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
