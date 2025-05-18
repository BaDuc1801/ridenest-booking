import axios from "axios";
import userService from "./userService";
import { jwtDecode } from "jwt-decode";

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
    async (config) => {
        const currentTime = new Date();
        const access_token : any = userService.getAccessToken();
        const decoded = jwtDecode(access_token);
        
        if (decoded?.exp && decoded.exp < currentTime.getTime() / 1000) {
          const data = await userService.refreshAccessToken();
          localStorage.setItem('access_token', JSON.stringify(data?.accessToken));
          config.headers["Authorization"] = `Bearer ${data?.accessToken}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
)

export default axiosJWT