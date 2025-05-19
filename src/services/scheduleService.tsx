import axiosJWT from "./axiosJWT";
import { IBus } from "./busService";
import { IRoute } from "./routeService";

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const scheduleUrl = `${apiUrl}/schedule`

export interface ISchedule {
    _id: string;
    busId: IBus;
    routeId: IRoute;
    startTime: string;
    endTime: string;
    availableSeats: number;
    seats: ISeat[];
    createdAt?: string;
    updatedAt?: string;
}

export interface ISeat {
    _id: string;
    seatNumber: string;
    isBooked: boolean;
    location: 'front' | 'middle' | 'back';
    price: number;
}

const scheduleService = {
    bookSeat: async (data: { scheduleId: string, seatNumber: string[] }) => {
        const rs = await axiosJWT.put(`${scheduleUrl}/book-seat`, data)
        return rs.data
    },

    getAllSchedules: async () => {
        const rs = await axiosJWT.get(`${scheduleUrl}/all`);
        return rs.data
    },

    createSchedule: async (data: {
        routeId: string,
        busId: string,
        startTime: string,
        endTime: string,
        price: {
            front: number,
            middle: number,
            back: number
        }
    }) => {
        const rs = await axiosJWT.post(`${scheduleUrl}`, data);
        return rs.data
    },

    updateSchedule: async (id: string, data: {
        startTime: string,
        endTime: string,
    }) => {
        const rs = await axiosJWT.put(`${scheduleUrl}/update/${id}`, data);
        return rs.data
    },

    deleteSchedule: async (id: string) => {
        const rs = await axiosJWT.delete(`${scheduleUrl}/${id}`);
        return rs.data
    },
}

export default scheduleService