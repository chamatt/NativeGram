import Reactotron, { asyncStorage } from "reactotron-react-native";
import { reactotronRedux } from "reactotron-redux";
import sagaPlugin from "reactotron-redux-saga";

if (__DEV__) {
  const tron = Reactotron.configure()
    .use(reactotronRedux())
    .use(sagaPlugin())
    .use(asyncStorage())
    .connect();
  tron.clear();
  console.tron = tron;
}
