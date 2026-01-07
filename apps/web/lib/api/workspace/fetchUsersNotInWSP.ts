import { AxiosResponse } from "axios";
import { api } from "../api";
const limit = 10;
export async function fetchUsersNotInWSorP(
  type: "WORKSPACE" | "PROJECT",
  pageParam: string | null,
  id: string,
  q: string,
  slug: string
) {
  let res: AxiosResponse;
  if (type == "WORKSPACE") {
    res = await api.get(
      `/api/proxy/user/workspaces/${id}/users?limit=${limit}&cursor=${
        pageParam ?? ""
      }&q=${q}&wsSlug=${slug}`
    );
    return res.data;
  }
  res = await api.get(
    `/api/proxy/user/project/${id}/users?limit=${limit}&cursor=${pageParam}&q=${q}&wsSlug=${slug}`
  );
  return res.data;
}
