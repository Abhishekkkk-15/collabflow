import { createSlice, PayloadAction } from "@reduxjs/toolkit";

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
};

type TWorkspaceState = {
  workspaces: TWorkspace[];
  activeWorkspaceId: string | null;
};

const initialState: TWorkspaceState = {
  workspaces: [],
  activeWorkspaceId: null,
};

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
      action: PayloadAction<{ id: string; data: Partial<TWorkspace> }>
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
