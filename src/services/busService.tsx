import axiosJWT from "./axiosJWT";

export interface IBus {
  _id: string;
  img: string[];
  totalSeats: number;
  status: 'active' | 'inactive';
  owner?: string;
  licensePlate: string;
  reviews?: string[];
  createdAt?: string;
  updatedAt?: string;
}

const apiUrl = process.env.NEXT_PUBLIC_BE_URL;
const busUrl = `${apiUrl}/bus`

const busService = {
  getReview: async (busId: string) => {
    const rs = await axiosJWT.get(`${busUrl}/review/${busId}`)
    return rs.data.reviews
  },

  getAllBus: async () => {
    const rs = await axiosJWT.get(`${busUrl}`);
    return rs.data
  },

  delBus: async (id: string) => {
    const rs = await axiosJWT.delete(`${busUrl}/${id}`);
    return rs.data
  },

  updateBus: async (busId: string, data: { status: string }) => {
    const rs = await axiosJWT.put(`${busUrl}/update/${busId}`, data);
    return rs.data;
  },

  createBus: async (data: {
    totalSeats: string,
    owner: string,
    licensePlate: string
  }) => {
    const rs = await axiosJWT.post(`${busUrl}/add`, data);
    return rs.data;
  },

  updateImg: async (id: string, data: FormData) => {
    const rs = await axiosJWT.put(`${busUrl}/img/${id}`, data, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    return rs.data;
  }
}

export default busService