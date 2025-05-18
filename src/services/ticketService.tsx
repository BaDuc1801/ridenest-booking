import axiosJWT from "./axiosJWT";
import { IReview } from "./reviewService";
import userService from "./userService";

export interface ITicket {
    _id?: string;
    userId: string;
    status: string;
    paymentMethod: string;
    scheduleId: any;
    seatNumbers: string[];
    price: number;
    phoneNumber: string;
    email: string;
    username?: string;
    voucher?: string;
    hasReviewed?: false;
    createdAt?: string;
    updatedAt?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const ticketUrl = `${apiUrl}/tickets`;

const ticketService = {
    postTicket: async (data: ITicket) => {
        const rs = await axiosJWT.post(`${ticketUrl}`, data);
        return rs.data
    },

    getTicketByUserId: async () => {
        const accessToken = userService.getAccessToken();
        const rs = await axiosJWT.get(`${ticketUrl}/userId`, {
            headers: {
                Authorization: `Bearer ${accessToken}`
            }
        });
        return rs.data
    },

    cancelTicket: async (ticketId: string) => {
        const rs = await axiosJWT.put(`${ticketUrl}/cancel`, { ticketId })
        return rs.data
    },

    addReview: async (data: IReview) => {
        const rs = await axiosJWT.post(`${ticketUrl}/review`, data);
        return rs.data
    },

    getAllTicket: async () => {
        const rs = await axiosJWT.get(`${ticketUrl}/all`)
        return rs.data
    }
}

export default ticketService
