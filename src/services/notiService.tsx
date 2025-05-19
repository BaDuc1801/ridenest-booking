import axiosJWT from "./axiosJWT";

export interface INoti {
    _id: string;
    username: string;
    phoneNumber: number;
    email: string;
    garage: string;
    read: boolean;
    createdAt?: string;
    updatedAt?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const notiUrl = `${apiUrl}/noti`

const notiService = {
    postNoti: async (data: { username: string, phoneNumber: string, email: string, garage: string }) => {
        const rs = await axiosJWT.post(`${notiUrl}`, data);
        return rs.data
    },

    getNoti: async () => {
        const rs = await axiosJWT.get(`${notiUrl}/all`);
        return rs.data
    },

    getNotiById: async (id: string) => {
        const rs = await axiosJWT.get(`${notiUrl}/id/${id}`);
        return rs.data
    },

    readNoti: async (id: string) => {
        const rs = await axiosJWT.put(`${notiUrl}/${id}`);
        return rs.data
    },
}

export default notiService