import { IUser } from "@/services/userService";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: IUser = {
  _id: "",
  username: "",
  phoneNumber: "",
  email: "",
  avatar:
    "https://res.cloudinary.com/dzpw9bihb/image/upload/v1726676632/wgbdsrflw8b1vdalkqht.jpg",
  role: "Customer",
  owner: "",
  createdAt: "",
  updatedAt: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<IUser>) => {
      Object.assign(state, action.payload);
    },
    setUserAvatar: (state, action: PayloadAction<string>) => {
      state.avatar = action.payload;
    },
    resetUser: (state) => {
      Object.assign(state, initialState);
    },
  },
});

export const { setUser, resetUser, setUserAvatar } = userSlice.actions;
export const userStore = userSlice.reducer;
