import axios from "axios";
import { REACT_APP_API_ENDPOINT } from "react-native-dotenv";

console.warn(REACT_APP_API_ENDPOINT);

const baseURL = `${REACT_APP_API_ENDPOINT || "http://localhost:1337"}`;
const api = axios.create({
  baseURL,
});

export default api;
