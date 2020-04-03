import ApolloClient from "apollo-boost";
import { REACT_APP_API_ENDPOINT } from "react-native-dotenv";
import { AsyncStorage } from "react-native";

const client = new ApolloClient({
  uri: `${REACT_APP_API_ENDPOINT || "http://localhost:1337"}/graphql`,
  request: async operation => {
    const token = await AsyncStorage.getItem("@nativegram/token");
    operation.setContext({
      headers: {
        authorization: token ? `Bearer ${token}` : ""
      }
    });
  }
});

export default client;
