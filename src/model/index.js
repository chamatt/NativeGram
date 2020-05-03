import { createStore } from "easy-peasy";
import auth from "./auth";
import createPost from "./createPost";
import editProfile from "./editProfile";
import { persistStore, persistReducer } from "redux-persist";
import { AsyncStorage } from "react-native";

const persistConfig = {
  key: "@nativegram/persist",
  storage: AsyncStorage,
  blacklist: ["editProfile", "createPost"],
};

const storeModel = { auth, createPost, editProfile };

export const store = createStore(storeModel, {
  reducerEnhancer: (reducer) => persistReducer(persistConfig, reducer),
});
export const persistor = persistStore(store);
