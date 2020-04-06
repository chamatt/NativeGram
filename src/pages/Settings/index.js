import React from "react";
import { SafeAreaView } from "~/components/SafeArea";
import { Drawer, DrawerHeaderFooter, Icon } from "@ui-kitten/components";
import { useStoreState, useStoreActions } from "easy-peasy";

const PersonIcon = (style) => <Icon {...style} name="person" />;

const Header = () => (
  <DrawerHeaderFooter
    title="John Doe"
    description="React Native Developer"
    icon={PersonIcon}
  />
);

const drawerData = [
  { title: "Dashboard" },
  { title: "Messages" },
  { title: "Settings" },
  { title: "Articles" },
  { title: "Ecommerce" },
  { title: "Logout" },
];

const Settings = () => {
  const signOut = useStoreActions((actions) => actions.auth.signOut);

  const onRouteSelect = (index) => {
    const route = drawerData[index];

    if (route.title == "Logout") {
      console.warn("Should Logout");
      signOut();
    }
    // navigate with React Navigation
    // this.props.navigation.navigate(route.title);
  };

  return (
    <SafeAreaView>
      <Drawer data={drawerData} header={Header} onSelect={onRouteSelect} />
    </SafeAreaView>
  );
};

export default Settings;
