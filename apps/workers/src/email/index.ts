import { Worker, Queue } from "bullmq";
import { connection } from "../index";
import { resend } from "../config/resend";
import { EmailType } from "./email.types";
import { renderEmail } from "./email.renderer";
export type EmailJobData = {
  to: string;
  subject: string;
  type: EmailType;
  payload: Record<string, any>;
};

export function startEmailWorker() {
  console.log("Email worker running");

  new Worker(
    "emailQueue",
    async (job) => {
      const { to, subject, type, payload } = job.data as {
        to: string;
        subject: string;
        type: EmailType;
        payload: Record<string, any>;
      };

      const html = renderEmail(type, payload);
      console.log("data", to, subject, type, payload);
      try {
        await resend.emails.send({
          from: "CollabFlow <no-reply@mail.collabflow.abhishekkkk.in>",
          to,
          subject,
          html,
        });
        console.log("Email sent");
      } catch (error) {
        console.log("Error while send email", error);
      }
    },
    {
      connection,
      concurrency: 5,
      lockDuration: 60_000,
    }
  );
}
