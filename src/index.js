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

const App = () => {
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

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <App />
    </ApplicationProvider>
  </>
);
