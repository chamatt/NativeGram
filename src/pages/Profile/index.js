import React from "react";
import { Layout, Text, Button } from "@ui-kitten/components";
import { useStoreActions } from "easy-peasy";

const Profile = () => {
  const signOut = useStoreActions(actions => actions.auth.signOut);
  return (
    <Layout style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text category="h1">Profile</Text>
      <Button onPress={() => signOut()} status="danger">
        LOGOUT
      </Button>
    </Layout>
  );
};

export default Profile;
