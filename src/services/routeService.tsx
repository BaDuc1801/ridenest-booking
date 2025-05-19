import axios from "axios";
import { ISchedule } from "./scheduleService";
import axiosJWT from "./axiosJWT";

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const routeUrl = `${apiUrl}/routes`

export interface IRoute {
    _id?: string;
    img?: string;
    origin: string;
    destination: string;
    basisPrice: number;
    afterDiscount: number;
    schedules?: ISchedule[];
}

const routeService = {
    getAllRoutes: async (): Promise<IRoute[]> => {
        const rs = await axios.get<IRoute[]>(`${routeUrl}`);
        return rs.data
    },

    createRoute: async (data: IRoute) => {
        const rs = await axiosJWT.post(`${routeUrl}`, data);
        return rs.data
    },

    findSchedule: async (params: {
        origin?: string;
        destination?: string;
        startTime?: string | null;
    }) => {
        const rs = await axios.get(`${routeUrl}/find-schedule`, {
            params: params
        })
        return rs.data
    },

    updateSchedule: async (id: string, routeForm: { origin: string; destination: string; basisPrice: number; afterDiscount: number; }) => {
        const rs = await axiosJWT.put(`${routeUrl}/${id}`, routeForm)
        return rs.data
    },

    delSchedule: async (id: string) => {
        const rs = await axiosJWT.delete(`${routeUrl}/${id}`)
        return rs.data
    }
}

export default routeService
