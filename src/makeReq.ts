import axios from "axios";

const token = localStorage.getItem("_auth");

export const makeReq = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  headers: {
    Authorization: "Bearer " + token,
  },
});


