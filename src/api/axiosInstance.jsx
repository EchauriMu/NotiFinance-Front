import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:80/api/v1", // Base URL de tu API
  withCredentials: true, // Permite el uso de cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
