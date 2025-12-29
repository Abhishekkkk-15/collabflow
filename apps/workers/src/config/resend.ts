import { config } from "dotenv";
import { Resend } from "resend";
config();
export const resend = new Resend(process.env.RESEND_API_KEY);
