import axios from "axios";
import Cookies from "js-cookie";

const axiosApiInstance = axios.create({
    baseURL:process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"
})


axiosApiInstance.interceptors.request.use(
  (config) => {
    const token = Cookies.get("adminToken"); // client side cookie
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


module.exports={axiosApiInstance};