import axios from "axios";

export interface UserProps {
  username: string;
  email: string;
  password: string;
}

export interface UserLoginProps {
  username?: string;
  password?: string | number;
}

export interface PinProps {
  _id: string;
  username: string | number;
  title: string;
  desc: string;
  rating: number;
  lat: number;
  lon: number;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

export interface newpinProps {
  username: string | null;
  title: string | null;
  desc: string | null;
  rating: number | string;
  lat: number | undefined;
  lon: number | undefined;
}

const API = axios.create({
  baseURL: "https://mern-travel-app-backend.herokuapp.com/api",
});

export const axiosGetPins = () => API.get<PinProps[]>(`/pins`);
export const axiosPostPins = (newPin: newpinProps) => API.post(`pins`, newPin);
export const axiosRegister = (newUser: UserProps) =>
  API.post(`/users/register`, newUser);
export const axiosLogin = (userLogin: UserLoginProps) =>
  API.post(`/users/login`, userLogin);
