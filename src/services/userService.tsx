import axios from "axios";
import axiosJWT from "./axiosJWT";
import { toast } from "react-toastify";

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const userUrl = `${apiUrl}/users`;

let hasToastShown = false;

export interface IUser {
    _id: string;
    username: string;
    phoneNumber: string;
    avatar: string;
    email: string;
    password?: string;
    role: string;
    owner: string;
    createdAt?: string;
    updatedAt?: string;
}

const userService = {
    getAccessToken: () => {
        const token = localStorage.getItem("access_token");
        return token ? JSON.parse(token) : null;
    },

    login: async (email: string, password: string) => {
        const res = await axios.post(`${userUrl}/login`, {
            email,
            password
        }, {
            withCredentials: true,
        })
        return res.data
    },

    register: async (email: string, username: string, password: string) => {
        const res = await axios.post(`${userUrl}/register`, {
            email,
            username,
            password
        })
        return res.data
    },

    getUserInformation: async () => {
        try {
            const accessToken = userService.getAccessToken();
            const rs = await axiosJWT.get(`${userUrl}/infor`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return rs.data;
        } catch (error) {
            if (!hasToastShown) {
                toast.info("Phiên đăng nhập hết hạn");
                console.log(error)
                hasToastShown = true;
            }
            localStorage.removeItem('access_token');
        }
    },

    logOut: async () => {
        const response = await axios.post(`${userUrl}/logout`);
        return response.data;
    },

    refreshAccessToken: async () => {
        const res = await axios.post(`${userUrl}/refresh-token`,
            {},
            {
                withCredentials: true,     // Lấy cookies chứa refreshToken cho vào req
            }
        );
        return res.data
    },

    updateUser: async (data: {
        username: string;
        email: string;
        phoneNumber: string;
        avatar?: string;
    }) => {
        const accessToken = userService.getAccessToken();
        const res = await axiosJWT.put(`${userUrl}/update-user`, data, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return res.data
    },

    updateAvatar: async (avatar: FormData) => {
        const accessToken = userService.getAccessToken();
        const res = await axiosJWT.put(`${userUrl}/up-avatar`, avatar, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
        return res.data
    },

    changePassword: async (oldP: string, newP: string) => {
        const accessToken = userService.getAccessToken()
        await axiosJWT.put(`${userUrl}/change-password`, { oldP, newP }, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        })
    },

    getAllUser: async () => {
        const res = await axiosJWT.get(`${userUrl}`)
        return res.data
    },

    deleteUser: async (userId: string) => {
        const res = await axiosJWT.delete(`${userUrl}/${userId}`)
        return res.data
    },

    updateUserById: async (userId: string, data: {
        username: string,
        email: string,
        phoneNumber: string,
    }) => {
        const res = await axiosJWT.put(`${userUrl}/userId/${userId}`, data)
        return res.data
    },

    addOperator: async (data: {
        username: string;
        email: string;
        phoneNumber: string;
        owner: string;
    }) => {
        const res = await axiosJWT.put(`${userUrl}/email`, data)
        return res.data
    },

    sendEmail: async (email: string) => {
        const res = await axios.post(`${userUrl}/forgot-password`, { email })
        return res.data
    }
}

export default userService