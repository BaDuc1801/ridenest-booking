import axios from "axios";
import userService from "./userService";
import {jwtDecode} from "jwt-decode";

const axiosJWT = axios.create();

axiosJWT.interceptors.request.use(
  async (config) => {
    const access_token = userService.getAccessToken();
    if (typeof access_token === 'string' && access_token.trim() !== '') {
      const decoded: { exp?: number } = jwtDecode(access_token);
      const currentTime = Date.now() / 1000;

      if (decoded.exp && decoded.exp < currentTime) {
        const data = await userService.refreshAccessToken();
        localStorage.setItem('access_token', data?.accessToken ?? '');
        config.headers["Authorization"] = `Bearer ${data?.accessToken}`;
      } else {
        config.headers["Authorization"] = `Bearer ${access_token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosJWT;
