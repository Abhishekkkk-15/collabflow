import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const projectSlice = createSlice({
  name: "project",
  initialState: {
    project: null,
  },
  reducers: {
    updateProjectInStore(state, action: PayloadAction<any>) {
      state.project = action.payload;
    },
  },
});
export const { updateProjectInStore } = projectSlice.actions;
export default projectSlice.reducer;
