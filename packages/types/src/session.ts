import { User } from "./user";
export interface Session {
  expires: Date;
  user: Pick<User, "email" | "id" | "image" | "name" | "role">;
}
