"use client";

import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";

export default function ClientSessionSync({ session }: { session: any }) {
  const dispatch = useDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          id: session.user.id,
          name: session.user.name,
          email: session.user.email,
          image: session.user.image,
          role: session.user.role,
        })
      );
    } else {
      dispatch(clearUser());
    }
  }, [session]);

  return null; // no UI
}
