import React from "react";
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

const App = () => {
  // const [theme, setTheme] = React.useState("light");
  // const currentTheme = themes[theme];

  // const toggleTheme = () => {
  //   const nextTheme = theme === "light" ? "dark" : "light";
  //   setTheme(nextTheme);
  // };

  const theme = useTheme();
  return (
    <ThemeProvider theme={theme}>
      <ApolloProvider client={client}>
        <StoreProvider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <Layout style={{ flex: 1 }}>
              <Routes />
            </Layout>
          </PersistGate>
        </StoreProvider>
      </ApolloProvider>
    </ThemeProvider>
  );
};

const AppProvider = () => {
  const { currentTheme, toggleThemeType } = useEvaTheme();
  return (
    <>
      <IconRegistry icons={EvaIconsPack} />
      <ApplicationProvider {...eva} theme={currentTheme}>
        <App />
      </ApplicationProvider>
    </>
  );
};

export default () => {
  return (
    <ThemeContextProvider>
      <AppProvider />
    </ThemeContextProvider>
  );
};
