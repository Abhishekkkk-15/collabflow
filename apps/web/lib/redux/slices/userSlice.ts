import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type AppUser = {
  id: string;
  name: string | null;
  email: string | null;
  image?: string | null;
  role?: string | null;
};

export type UserProjectRoles = {
  id: string;
  role: string;
  projectId: string;
  meta: any;
};

export type UserWorkspaceRoles = {
  id: string;
  role: string;
  workspaceId: string;
};
type UserState = {
  user: AppUser | null;
  authenticated: boolean;
  userRoles: {
    workspaceRoles: UserWorkspaceRoles[] | null;
    projectRoles: UserProjectRoles[] | null;
  };
};

const initialState: UserState = {
  user: null,
  authenticated: false,
  userRoles: { projectRoles: null, workspaceRoles: null },
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser(state, action: PayloadAction<any>) {
      state.user = action.payload.user;
      state.authenticated = true;
      state.userRoles = action.payload.roles;
    },
    clearUser(state) {
      state.user = null;
      state.authenticated = false;
      state.userRoles = { projectRoles: null, workspaceRoles: null };
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;
export default userSlice.reducer;
