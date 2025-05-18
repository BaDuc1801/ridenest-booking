import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface ISearch {
  origin: string;
  destination: string;
  booking_date: string | string[] | null;
  tripType: number;
  departure?: {
    scheduleId: string;
    startTime: string;
    endTime: string;
    busId: string;
    licensePlate: string;
    totalSeats: number;
    seatNumber: string[];
  };
  return?: {
    scheduleId: string;
    startTime: string;
    endTime: string;
    busId: string;
    licensePlate: string;
    totalSeats: number;
    seatNumber: string[];
  };
  ticketPrice: {
    departurePrice: number;
    returnPrice: number;
  };
}

const initialState: ISearch = {
  origin: "",
  destination: "",
  booking_date: null,
  tripType: 0,
  departure: {
    scheduleId: "",
    startTime: "",
    endTime: "",
    busId: "",
    licensePlate: "",
    totalSeats: 0,
    seatNumber: [],
  },
  return: {
    scheduleId: "",
    startTime: "",
    endTime: "",
    busId: "",
    licensePlate: "",
    totalSeats: 0,
    seatNumber: [],
  },
  ticketPrice: {
    departurePrice: 0,
    returnPrice: 0,
  },
};

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setOrigin(state, action: PayloadAction<string>) {
      state.origin = action.payload;
    },
    setDestination(state, action: PayloadAction<string>) {
      state.destination = action.payload;
    },
    setBookingDate(state, action: PayloadAction<string | string[] | null>) {
      state.booking_date = action.payload;
    },
    setTripType(state, action: PayloadAction<number>) {
      state.tripType = action.payload;
    },
    setDeparture(state, action: PayloadAction<typeof initialState.departure>) {
      state.departure = action.payload;
    },
    setReturn(state, action: PayloadAction<typeof initialState.return>) {
      state.return = action.payload;
    },
    resetTrip(state) {
      state.departure = undefined;
      state.return = undefined;
      state.ticketPrice = {
        departurePrice: 0,
        returnPrice: 0,
      };
    },
    setTicketDeparturePrice(state, action: PayloadAction<number>) {
      state.ticketPrice.departurePrice = action.payload;
    },
    setTicketReturnPrice(state, action: PayloadAction<number>) {
      state.ticketPrice.returnPrice = action.payload;
    },
  },
});

export const {
  setOrigin,
  setDestination,
  setBookingDate,
  setTripType,
  setDeparture,
  setReturn,
  setTicketDeparturePrice,
  setTicketReturnPrice,
  resetTrip,
} = searchSlice.actions;
export const searchStore = searchSlice.reducer;
