import { thunk, action } from "easy-peasy";
import { AsyncStorage, Alert } from "react-native";
import api from "~/services/api";

const INITIAL_STATE = {
  images: [],
  current: 0,
};

export default {
  ...INITIAL_STATE,

  newImage: thunk((actions, payload, { getState }) => {
    actions.setCurrent(getState().images.length);
  }),
  saveImage: action((state, payload) => {
    state.images[state.current] = payload;
  }),
  setCurrent: action((state, payload) => {
    state.current = payload;
  }),
  reset: action((state, payload) => {
    state.images = [];
    state.current = 0;
  }),
};
