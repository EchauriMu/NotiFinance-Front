import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:82/api/v1",
  withCredentials: true, // Permite el uso de cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
