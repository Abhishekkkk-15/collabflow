import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./slices/userSlice";
import workspaceReducer from "./slices/workspace";
import projectReducer from "./slices/project";
export const store = configureStore({
  reducer: {
    user: userReducer,
    workspace: workspaceReducer,
    project: projectReducer,
  },
});
export type RootStore = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
