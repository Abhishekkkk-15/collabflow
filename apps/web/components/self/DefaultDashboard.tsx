// Reference image (for layout & visual guidance):
// /mnt/data/ChatGPT Image Nov 23, 2025, 10_06_07 PM.png
"use client"
import React from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink } from "@/components/ui/breadcrumb";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

type Stats = { label: string; value: string; sub?: string };

const stats: Stats[] = [
  { label: "Workspaces", value: "3", sub: "Projects" },
  { label: "Projects", value: "6", sub: "Tasks" },
  { label: "Tasks", value: "4", sub: "Due Today" },
];

const workspaces = [
  { title: "Fun E-commerce Team", meta: "Members · 3 Projects · 1 ul ago", time: "5 min ago" },
  { title: "Blogging App Team", meta: "Members · 2 Projects", time: "12 min ago" },
  { title: "College Final Year Project", meta: "Members · 1 Project", time: "1 hr ago" },
];

export default function DefaultDashboard({ user }: { user?: { name?: string; image?: string } }) {
  return (
    <div>

        {/* BODY */}
        <div className="p-6">
          <div className="flex items-start gap-6">
            <div className="flex-1">
              <h1 className="text-3xl font-extrabold">Hello, {user?.name ?? "Abhishek"} <span>👋</span></h1>
              <p className="text-muted-foreground mt-1">Here’s your workspace summary for today</p>

              <div className="mt-6 grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <Card key={s.label} className="p-4">
                    <CardContent className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-md bg-sky-100 flex items-center justify-center text-sky-600 font-semibold"> 
                          {/* icon placeholder */}
                          📁
                        </div>
                        <div>
                          <div className="text-sm text-muted-foreground">{s.sub}</div>
                          <div className="text-lg font-semibold">{s.label}: {s.value}</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <h3 className="mt-6 text-lg font-semibold">Your Workspaces</h3>

              <div className="mt-3 space-y-3">
                {workspaces.map((w) => (
                  <div key={w.title} className="border rounded-lg p-4 flex items-center justify-between">
                    <div>
                      <div className="font-semibold">{w.title}</div>
                      <div className="text-sm text-muted-foreground mt-1">{w.meta}</div>
                    </div>
                    <div className="text-sm text-muted-foreground">{w.time}</div>
                  </div>
                ))}
              </div>

              <div className="mt-6">
                <h4 className="font-semibold">Recent Activity</h4>
                <ul className="list-disc mt-3 text-sm text-muted-foreground space-y-2 shadow-sm border rounded-lg p-4 pl-8 ">
                  <li>Aayush moved "Login Page UI" to Done <span className="text-xs text-muted-foreground ml-6">5 nh ago</span></li>
                  <li>Rohan commented on task "Navbar Fix" <span className="text-xs text-muted-foreground ml-6">20 min ago</span></li>
                  <li>You created workspace "College Final Year" <span className="text-xs text-muted-foreground ml-6">1 hour ago</span></li>
                  <li>Shyam added new project "API Cleanup" <span className="text-xs text-muted-foreground ml-6">2 hours ago</span></li>
                </ul> 

                <div className="mt-6">
                  <h4 className="font-semibold">Upcoming Deadlines</h4>
                  <ul className="list-disc mt-3 text-sm text-muted-foreground space-y-2 shadow-sm border rounded-lg p-4 pl-8">
                    <li>Fix DB schema <span className="ml-6 text-xs">Due tomorrow</span></li>
                    <li>Write product description <span className="ml-6 text-xs">Due in clays</span></li>
                    <li>Add refresh tokens to login system <span className="ml-6 text-xs">4 days</span></li>
                  </ul>
                </div>
              </div>
            </div>

            {/* RIGHT RAIL */}
            <div className="w-64 space-y-4">
              

              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Deadlines</CardTitle>
                </CardHeader>
                <CardContent className="h-28 flex items-center justify-center text-muted-foreground">Chart Placeholder</CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Workspace Contribution</CardTitle>
                </CardHeader>
                <CardContent className="h-28 flex items-center justify-center text-muted-foreground">Chart Placeholder</CardContent>
              </Card>

              <div className="mt-2 text-center text-xs text-muted-foreground">
                

            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
