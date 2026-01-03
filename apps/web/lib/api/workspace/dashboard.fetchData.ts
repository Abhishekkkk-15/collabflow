import { api } from "../api";

export async function fetchWorkspace() {
  try {
    const res = await api.get("/workspace/dashboard");
    return res.data;
  } catch (error: any) {
    console.log("error", error);
  }
}
