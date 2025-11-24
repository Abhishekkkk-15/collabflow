import { auth } from "@/auth";
import { LoginForm } from "@/components/login-form";
import { redirect } from "next/navigation";
import { type Session } from "@collabflow/types";
export default async function LoginPage() {
  const session: Session = await auth();
  if (session) redirect("/dashboard");
  console.log("session : ", session);
  return (
    <div className="bg-muted flex min-h-svh flex-col items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-sm md:max-w-4xl">
        <LoginForm />
      </div>
    </div>
  );
}
