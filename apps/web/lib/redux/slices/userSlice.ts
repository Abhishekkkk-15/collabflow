import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role?: string | null;
};

type UserState = {
  user: AppUser | null;
  authenticated: boolean;
};

const initialState: UserState = {
  user: null,
  authenticated: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<AppUser>) {
      state.user = action.payload;
      state.authenticated = true;
    },
    clearUser(state) {
      state.user = null;
      state.authenticated = false;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
