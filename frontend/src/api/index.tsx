import { PinProps } from "App";
import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-travel-app-backend.herokuapp.com/api",
});

export const axiosGetPins = () => API.get<PinProps[]>(`/pins`);
