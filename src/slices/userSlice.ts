import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface UserState {
  user_login: string;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  user_login: "",
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<string>) {
      state.user_login = action.payload;
      state.isAuthenticated = true;
    },
    resetUser(state) {
      state.user_login = "";
      state.isAuthenticated = false;
    },
  },
});

export const { setUser, resetUser } = userSlice.actions;
export default userSlice.reducer;
