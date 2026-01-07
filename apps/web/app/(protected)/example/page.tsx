import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  MoreHorizontal,
  Filter,
  Plus,
  Settings,
} from "lucide-react";
import { InviteMembers } from "@/components/self/InviteMembers";

export default function TasksTable() {
  const tasks = [
    {
      id: "TASK-8782",
      tag: "Documentation",
      title:
        "You can't compress the program without quantifying the open-source SSD ...",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "TASK-7878",
      tag: "Documentation",
      title:
        "Try to calculate the EXE feed, maybe it will index the multi-byte pixel!",
      status: "Backlog",
      priority: "Medium",
    },
    {
      id: "TASK-7839",
      tag: "Bug",
      title: "We need to bypass the neural TCP card!",
      status: "Todo",
      priority: "High",
    },
    {
      id: "TASK-5562",
      tag: "Feature",
      title:
        "The SAS interface is down, bypass the open-source pixel so we can back u...",
      status: "Backlog",
      priority: "Medium",
    },
    {
      id: "TASK-8686",
      tag: "Feature",
      title:
        "I'll parse the wireless SSL protocol, that should driver the API panel!",
      status: "Canceled",
      priority: "Medium",
    },
    {
      id: "TASK-1280",
      tag: "Bug",
      title:
        "Use the digital TLS panel, then you can transmit the haptic system!",
      status: "Done",
      priority: "High",
    },
    {
      id: "TASK-7262",
      tag: "Feature",
      title:
        "The UTF8 application is down, parse the neural bandwidth so we can back ...",
      status: "Done",
      priority: "High",
    },
    {
      id: "TASK-1138",
      tag: "Feature",
      title:
        "Generating the driver won't do anything, we need to quantify the 1080p SM...",
      status: "In Progress",
      priority: "Medium",
    },
    {
      id: "TASK-7184",
      tag: "Feature",
      title: "We need to program the back-end THX pixel!",
      status: "Todo",
      priority: "Low",
    },
  ];

  return (
    <div className="p-4 w-full bg-background text-foreground">
      {/* Top Bar */}
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-2 items-center">
          <Input placeholder="Filter tasks..." className="w-64" />
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Status
          </Button>
          <Button variant="outline" className="flex gap-2">
            <Filter size={16} /> Priority
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" className="flex gap-2">
            <Settings size={16} /> View
          </Button>
          <Button className="bg-purple-500 hover:bg-purple-600 text-white flex gap-2">
            <Plus size={16} /> Add Task
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="border rounded-md overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-muted-foreground">
            <tr>
              <th className="p-3 text-left">
                <Checkbox />
              </th>
              <th className="p-3 text-left flex items-center gap-1">Task</th>
              <th className="p-3 text-left">Title</th>
              <th className="p-3 text-left cursor-pointer flex items-center gap-1">
                Status <ArrowUpDown size={14} />
              </th>
              <th className="p-3 text-left cursor-pointer flex items-center gap-1">
                Priority <ArrowUpDown size={14} />
              </th>
              <th className="p-3"></th>
            </tr>
          </thead>

          <tbody>
            {tasks.map((task) => (
              <tr
                key={task.id}
                className="border-t hover:bg-muted/20 transition">
                <td className="p-3">
                  <Checkbox />
                </td>

                <td className="p-3 font-medium">{task.id}</td>

                <td className="p-3 max-w-xl truncate flex items-center gap-2">
                  <span className="text-xs px-2 py-1 rounded-full bg-muted/50 border">
                    {task.tag}
                  </span>
                  {task.title}
                </td>

                <td className="p-3">
                  <span className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-muted-foreground rounded-full" />
                    {task.status}
                  </span>
                </td>

                <td className="p-3">{task.priority}</td>
                <InviteMembers roleType="PROJECT" slug="dsfasdas" />
                <td className="p-3">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <p className="px-2 py-1 text-sm">Edit</p>
                      <p className="px-2 py-1 text-sm">Delete</p>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
