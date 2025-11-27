import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "@/lib/api";

export type TProject = {
  id: string;
  name: string;
  slug: string;
};

export type TWorkspace = {
  id: string;
  slug: string;
  name: string;
  ownerId: string;
  projects: TProject[];
  owner: TOwnerType;
};

export type TOwnerType = {
  id: string;
  name: string;
  email: string;
  image: string;
};

type TWorkspaceState = {
  workspaces: TWorkspace[];
  activeWorkspaceId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: TWorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
  status: "idle",
  error: null,
};

export const fetchWorkspaces = createAsyncThunk<
  TWorkspace[],
  void,
  { rejectValue: string }
>("workspace/fetchWorkspaces", async (_, { rejectWithValue }) => {
  try {
    const res = await api.get("/workspace");
    return res.data.workspaces as TWorkspace[];
  } catch (err: any) {
    const message =
      err?.response?.data?.message ||
      err?.message ||
      "Failed to load workspaces";
    return rejectWithValue(message);
  }
});

const workspaceSlice = createSlice({
  name: "workspace",
  initialState,
  reducers: {
    setWorkspaces(state, action: PayloadAction<TWorkspace[]>) {
      state.workspaces = action.payload;
    },

    addWorkspace(state, action: PayloadAction<TWorkspace>) {
      state.workspaces.push(action.payload);
    },

    updateWorkspace(
      state,
      action: PayloadAction<{
        id: string;
        data: any;
      }>
    ) {
      const ws = state.workspaces.find((w) => w.id === action.payload.id);
      if (ws) Object.assign(ws, action.payload.data);
    },

    removeWorkspace(state, action: PayloadAction<string>) {
      state.workspaces = state.workspaces.filter(
        (ws) => ws.id !== action.payload
      );

      if (state.activeWorkspaceId === action.payload) {
        state.activeWorkspaceId = null;
      }
    },

    setActiveWorkspace(state, action: PayloadAction<string | null>) {
      state.activeWorkspaceId = action.payload;
    },

    // ------- PROJECT OPERATIONS -------- //

    addProjectToWorkspace(
      state,
      action: PayloadAction<{ workspaceId: string; project: TProject }>
    ) {
      const ws = state.workspaces.find(
        (w) => w.id === action.payload.workspaceId
      );
      if (ws) ws.projects.push(action.payload.project);
    },

    updateProjectInWorkspace(
      state,
      action: PayloadAction<{
        workspaceId: string;
        projectId: string;
        data: Partial<TProject>;
      }>
    ) {
      const ws = state.workspaces.find(
        (w) => w.id === action.payload.workspaceId
      );
      if (!ws) return;

      ws.projects = ws.projects.map((p) =>
        p.id === action.payload.projectId ? { ...p, ...action.payload.data } : p
      );
    },

    removeProjectFromWorkspace(
      state,
      action: PayloadAction<{ workspaceId: string; projectId: string }>
    ) {
      const ws = state.workspaces.find(
        (w) => w.id === action.payload.workspaceId
      );
      if (!ws) return;

      ws.projects = ws.projects.filter(
        (p) => p.id !== action.payload.projectId
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWorkspaces.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchWorkspaces.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.workspaces = action.payload;
      })
      .addCase(fetchWorkspaces.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload ?? "Failed to fetch workspaces";
      });
  },
});

export const {
  setWorkspaces,
  addWorkspace,
  updateWorkspace,
  removeWorkspace,
  setActiveWorkspace,
  addProjectToWorkspace,
  updateProjectInWorkspace,
  removeProjectFromWorkspace,
} = workspaceSlice.actions;

export default workspaceSlice.reducer;
