// components/helper/ClientSessionSync.tsx
"use client";

import { useEffect } from "react";
import { useAppDispatch } from "@/lib/redux/hooks"; // typed hook
import { setUser, clearUser } from "@/lib/redux/slices/userSlice";

export default function ClientSessionSync({
  session,
  userRoles,
}: {
  session: any;
  userRoles: any;
}) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user) {
      dispatch(
        setUser({
          user: {
            id: session.user.id,
            name: session.user.name,
            email: session.user.email,
            image: session.user.image,
            role: session.user.role,
          },
          roles: {
            workspaceRoles: userRoles?.workspaceRoles ?? null,
            projectRoles: userRoles?.projectRoles ?? null,
          },
        })
      );
      return;
    }

    // no session -> clear user (runs once)
    dispatch(clearUser());
  }, []);

  return null;
}
