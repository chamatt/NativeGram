import { createStore } from "easy-peasy";
import auth from "./auth";
import createPost from "./createPost";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";

const persistConfig = {
  key: "@nativegram/persist",
  storage: AsyncStorage,
  //   whitelist: ["auth"],
};

const storeModel = { auth, createPost };

export const store = createStore(storeModel, {
  reducerEnhancer: (reducer) => persistReducer(persistConfig, reducer),
});
export const persistor = persistStore(store);
