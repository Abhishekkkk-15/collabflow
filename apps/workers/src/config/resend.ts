import { config } from "dotenv";
import { Resend } from "resend";
config();
console.log("api", process.env.RESEND_API_KEY);
export const resend = new Resend(process.env.RESEND_API_KEY);
