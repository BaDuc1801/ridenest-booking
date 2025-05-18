import { IRoute } from "@/services/routeService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface RouteState {
  list: IRoute[];
}

const initialState : RouteState = {
    list : [],
}

const routeSlice = createSlice({
    name: "route",
    initialState,
    reducers: {
        setListRoute(state, action : PayloadAction<IRoute[]>) {
            state.list = action.payload;
        },
    }
});

export const {setListRoute} = routeSlice.actions;
export const routeStore = routeSlice.reducer;