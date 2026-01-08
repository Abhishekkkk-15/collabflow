import { auth } from "@/auth";
import Home from "@/components/self/Home";
import React from "react";

export default async function page() {
  const session = await auth();
  let user: boolean = true;
  if (session?.user) {
    user = session.user ? false : true;
  } else {
    user = true;
  }

  return <Home isAuthenticated={user} />;
}
