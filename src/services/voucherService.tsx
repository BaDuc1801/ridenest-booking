import axios from "axios";
import axiosJWT from "./axiosJWT";
import userService from "./userService";

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const routeUrl = `${apiUrl}/vouchers`

export interface IVoucher {
    _id?: string;
    code?: string;
    name: string;
    discount: number;
    discountType: string;
    expiryDate?: string;
    description?: string;
    count?: number,
}

const voucherService = {
    getAllVouchers: async (): Promise<IVoucher[]> => {
        const rs = await axios.get<IVoucher[]>(`${routeUrl}`);
        return rs.data
    },

    createVoucher: async (data: IVoucher) => {
        const token = userService.getAccessToken()
        const rs = await axios.post(`${routeUrl}/create`, data, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return rs.data
    },

    deleteVoucher: async (id: string) => {
        const rs = await axiosJWT.delete(`${routeUrl}/${id}`);
        return rs.data
    },

    updateVoucher: async (id: string, data: {
        code: string,
        name: string,
        description: string,
        expiryDate: string
    }) => {
        const rs = await axiosJWT.put(`${routeUrl}/${id}`, data);
        return rs.data
    },
}

export default voucherService
