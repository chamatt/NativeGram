import React from "react";
import {
  ApplicationProvider,
  Layout,
  Text,
  IconRegistry
} from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import { EvaIconsPack } from "@ui-kitten/eva-icons";
import Routes from "~/routes";
import { StoreProvider } from "easy-peasy";
import { store } from "./model";

export default () => (
  <>
    <IconRegistry icons={EvaIconsPack} />
    <ApplicationProvider {...eva} theme={eva.light}>
      <StoreProvider store={store}>
        <Layout style={{ flex: 1 }}>
          <Routes />
        </Layout>
      </StoreProvider>
    </ApplicationProvider>
  </>
);
