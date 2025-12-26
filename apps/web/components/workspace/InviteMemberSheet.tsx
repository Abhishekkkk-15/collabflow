"use client";

import React, { useEffect, useRef, useState } from "react";
import { UserPlus, Loader2 } from "lucide-react";

import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "../ui/sheet";

import { Button } from "../ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";
import { Input } from "../ui/input";

import { WorkspaceRole, User } from "@prisma/client";
import { api } from "@/lib/api/api";
import { useInfiniteQuery } from "@tanstack/react-query";
import { Spinner } from "../ui/spinner";

export type InviteEntry = {
  userId: string;
  role: WorkspaceRole;
  email: string;
};

type InviteMemberSheetProps = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite?: (members: InviteEntry[]) => Promise<void> | void;
  disabled?: boolean;
  workspaceId: string;
  currentPath: "PROJECT" | "WORKSPACE";
  slug: string;
};

export default function InviteMemberSheet({
  open,
  onOpenChange,
  onInvite,
  disabled = false,
  workspaceId,
  currentPath,
  slug,
}: InviteMemberSheetProps) {
  const [loading, setLoading] = useState(false);
  const [inviteSelected, setInviteSelected] = useState<InviteEntry[]>([]);
  const [query, setQuery] = useState("");
  const [cursor, setCursor] = useState<string | null>(null);
  const ref = useRef<HTMLDivElement | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState(query);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);
  // const loadMoreRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 500);
    return () => clearTimeout(t);
  }, [query]);
  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    useInfiniteQuery({
      queryKey: ["members", debouncedQuery],
      enabled: open,
      queryFn: async ({ pageParam }) => {
        console.log("cursor", cursor);
        const res = await api.get(
          `user/workspaces/${workspaceId}/users?limit=4&cursor=${
            pageParam ?? ""
          }&q=${debouncedQuery}&wsSlug=${slug}`
        );
        console.log("mem", res);
        return res.data;
      },
      initialPageParam: null,
      refetchOnMount: true,
      getNextPageParam: (lastPage) => {
        return lastPage.hasNextPage ? lastPage.nextCursor : undefined;
      },
    });
  const members = data?.pages.flatMap((page) => page.users) ?? [];

  useEffect(() => {
    if (!ref.current || !hasNextPage) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          fetchNextPage();
        }
      },

      {
        root: scrollContainerRef.current,
        rootMargin: "200px",
      }
    );

    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [fetchNextPage, hasNextPage]);

  // async function fetchNonMembersP() {
  //   try {
  //     const res = await api.get(
  //       `user/project/${workspaceSlug}/users?limit=20&page=1`
  //     );

  //     console.log(res);

  //     if (Array.isArray(res.data)) {
  //       setNonMembers(res.data);
  //     } else {
  //       setNonMembers([]);
  //     }
  //   } catch (e) {
  //     console.error("Failed fetching non-members", e);
  //   }
  // }

  useEffect(() => {
    if (open) {
      setInviteSelected([]);
      setQuery("");
    }
  }, [open]);

  function toggleSelectUser(user: User) {
    const exists = inviteSelected.find((x) => x.userId === user.id);
    if (exists) {
      setInviteSelected((prev) => prev.filter((p) => p.userId !== user.id));
    } else {
      setInviteSelected((prev) => [
        ...prev,
        { userId: user.id, role: "CONTRIBUTOR", email: user.email! },
      ]);
    }
  }

  function setUserRole(user: User, role: WorkspaceRole) {
    setInviteSelected((prev) =>
      prev.map((p) =>
        p.userId === user.id ? { ...p, role, email: user.email! } : p
      )
    );
  }

  async function handleInvite() {
    if (!inviteSelected.length) return;

    try {
      setLoading(true);
      console.log("mem", inviteSelected);
      await onInvite?.(inviteSelected);
      onOpenChange(false);
    } catch (e) {
      console.error("Invite error", e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      {/* <SheetTrigger asChild>
        <Button variant="secondary" size="sm" disabled={disabled}>
          <UserPlus size={14} /> Invite
        </Button>
      </SheetTrigger> */}

      <SheetContent side="right" className="w-[520px]">
        <SheetHeader>
          <SheetTitle>Invite members</SheetTitle>
        </SheetHeader>

        <div className="p-4 space-y-4">
          {/* SEARCH */}
          <Input
            placeholder="Search users..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />

          <div className="text-sm text-muted-foreground">
            Select users to invite and assign roles.
          </div>

          {/* USERS LIST */}
          <div
            className="max-h-[48vh] h-full overflow-auto border  rounded p-2 space-y-2"
            ref={scrollContainerRef}>
            {members.map((m) => {
              const selected = inviteSelected.some((s) => s.userId === m.id);
              const role = inviteSelected.find((s) => s.userId === m.id)?.role;

              return (
                <div
                  key={m.id}
                  className={`
                    flex items-center gap-3 p-2 rounded cursor-pointer
                    ${selected ? "bg-muted" : "hover:bg-muted/40"}
                  `}
                  onClick={() => toggleSelectUser(m)}>
                  <Avatar className="h-8 w-8">
                    {m.image ? (
                      <AvatarImage src={m.image} />
                    ) : (
                      <AvatarFallback>{m.name?.[0]}</AvatarFallback>
                    )}
                  </Avatar>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium truncate">{m.name}</div>
                    <div className="text-xs text-muted-foreground truncate">
                      {m.email}
                    </div>
                  </div>

                  {/* ROLE SELECT (active only when selected) */}
                  <div
                    onClick={(e) => e.stopPropagation()} // prevent row toggle
                  >
                    <Select
                      disabled={!selected}
                      value={role}
                      onValueChange={(value: WorkspaceRole) =>
                        setUserRole(m, value)
                      }>
                      <SelectTrigger className="w-32 h-8">
                        <SelectValue placeholder="Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="VIEWER">Viewer</SelectItem>
                        <SelectItem value="CONTRIBUTOR">Contibitor</SelectItem>
                        <SelectItem value="MAINTAINER">Maintainer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              );
            })}
            <div ref={ref} className="h-12"></div>
          </div>
          {isFetching && (
            <div>
              <Spinner />
            </div>
          )}
          {/* ACTION BUTTONS */}
          <div className="flex justify-end gap-2">
            <Button
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={loading}>
              Cancel
            </Button>

            <Button
              onClick={handleInvite}
              disabled={loading || inviteSelected.length === 0}>
              {loading && <Loader2 className="animate-spin mr-2 h-4 w-4" />}
              Invite ({inviteSelected.length})
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
