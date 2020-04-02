import React from "react";
import { ApplicationProvider, Layout, Text } from "@ui-kitten/components";
import * as eva from "@eva-design/eva";
import Routes from "~/routes";

export default () => (
  <ApplicationProvider {...eva} theme={eva.light}>
    <Layout style={{ flex: 1 }}>
      <Routes />
    </Layout>
  </ApplicationProvider>
);
