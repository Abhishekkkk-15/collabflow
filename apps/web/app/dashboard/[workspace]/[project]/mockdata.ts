export const mockProject = {
  id: "proj_123",
  name: "Website Redesign",
  slug: "website-redesign",
  description:
    "A full redesign of the marketing website including brand refresh, improved SEO, and a new landing page system.",

  status: "isActive",
  priority: "HIGH",

  workspaceId: "ws_001",
  workspaceSlug: "marketing",
  unreadCount: 4,
  taskCount: 27,

  ownerId: "usr_001",
  owner: {
    id: "usr_001",
    name: "Abhishek Jangid",
    email: "abhishek@example.com",
    image: "https://randomuser.me/api/portraits/men/75.jpg",
  },

  members: [
    {
      id: "usr_001",
      name: "Abhishek Jangid",
      email: "abhishek@example.com",
      image: "https://randomuser.me/api/portraits/men/75.jpg",
      role: "owner",
    },
    {
      id: "usr_002",
      name: "Sarah Lee",
      email: "sarah@example.com",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
      role: "admin",
    },
    {
      id: "usr_003",
      name: "Michael Chen",
      email: "chen@example.com",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
      role: "member",
    },
    {
      id: "usr_004",
      name: "Alicia Gomez",
      email: "alicia@example.com",
      image: "https://randomuser.me/api/portraits/women/80.jpg",
      role: "member",
    },
    {
      id: "usr_005",
      name: "David Park",
      email: "david@example.com",
      image: "https://randomuser.me/api/portraits/men/52.jpg",
      role: "viewer",
    },
  ],
};
export const mockRecentTasks = [
  {
    id: "task_101",
    title: "Redesign landing page hero section",
    status: "In Progress",
    priority: "High",
    assignedTo: "Sarah Lee",
  },
  {
    id: "task_102",
    title: "Implement new brand color palette",
    status: "Todo",
    priority: "Medium",
    assignedTo: "Michael Chen",
  },
  {
    id: "task_103",
    title: "SEO audit & sitemap cleanup",
    status: "Completed",
    priority: "Low",
    assignedTo: "Alicia Gomez",
  },
  {
    id: "task_104",
    title: "Migrate components to design system",
    status: "In Progress",
    priority: "High",
    assignedTo: "David Park",
  },
];
export const mockProjectActivity = [
  {
    id: "act_1",
    type: "task_completed",
    message: "Sarah Lee completed **Landing Page Hero Section**",
    timestamp: "2 hours ago",
    user: {
      name: "Sarah Lee",
      image: "https://randomuser.me/api/portraits/women/65.jpg",
    },
  },
  {
    id: "act_2",
    type: "comment",
    message: "Michael Chen commented on *Brand Colors Update*",
    timestamp: "Yesterday",
    user: {
      name: "Michael Chen",
      image: "https://randomuser.me/api/portraits/men/36.jpg",
    },
  },
  {
    id: "act_3",
    type: "task_created",
    message: "New task **SEO Audit** added by Alicia",
    timestamp: "2 days ago",
    user: {
      name: "Alicia Gomez",
      image: "https://randomuser.me/api/portraits/women/80.jpg",
    },
  },
];
