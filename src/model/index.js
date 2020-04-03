import { createStore } from "easy-peasy";
import auth from "./auth";

const storeModel = { auth };

export const store = createStore(storeModel);
