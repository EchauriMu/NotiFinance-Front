import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://notifinance.azurewebsites.net/api/v1",
  withCredentials: true, // Permite el uso de cookies
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
