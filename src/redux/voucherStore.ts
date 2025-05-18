import { IVoucher } from "@/services/voucherService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface voucherState {
    list: IVoucher[]
}

const initialState : voucherState = {
    list : [],
}

const voucherSlice = createSlice({
    name: "voucher",
    initialState,
    reducers: {
        setListVoucher(state, action : PayloadAction<IVoucher[]>) {
            state.list = action.payload;
        },
    }
});

export const {setListVoucher} = voucherSlice.actions;
export const voucherStore = voucherSlice.reducer;