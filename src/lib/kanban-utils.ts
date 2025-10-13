import type { KanbanData, Task } from "@/components/providers/types";

export const initialKanbanData: KanbanData = {
  columns: [
    {
      id: "todo",
      title: "To Do",
      color: "bg-gray-100",
      tasks: [
        {
          id: "1",
          title: "Design System Setup",
          description:
            "Create a comprehensive design system with colors, typography, and components",
          priority: "high",
          createdAt: new Date(),
        },
        {
          id: "2",
          title: "API Integration",
          description: "Integrate with backend APIs for data fetching",
          priority: "medium",
          createdAt: new Date(),
        },
      ],
    },
    {
      id: "inprogress",
      title: "In Progress",
      color: "bg-blue-50",
      tasks: [
        {
          id: "3",
          title: "User Authentication",
          description: "Implement login and signup functionality",
          priority: "high",
          createdAt: new Date(),
        },
      ],
    },
    {
      id: "review",
      title: "Review",
      color: "bg-amber-50",
      tasks: [
        {
          id: "4",
          title: "Mobile Responsiveness",
          description: "Ensure the app works perfectly on mobile devices",
          priority: "medium",
          createdAt: new Date(),
        },
      ],
    },
    {
      id: "done",
      title: "Done",
      color: "bg-green-50",
      tasks: [
        {
          id: "5",
          title: "Project Setup",
          description:
            "Initialize Next.js project with TypeScript and Tailwind",
          priority: "low",
          createdAt: new Date(),
        },
      ],
    },
  ],
};

export const getPriorityColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "bg-red-200";
    case "medium":
      return "bg-amber-200";
    case "low":
      return "bg-green-200";
    default:
      return "bg-gray-200";
  }
};

export const getPriorityTextColor = (priority: Task["priority"]) => {
  switch (priority) {
    case "high":
      return "text-red-700";
    case "medium":
      return "text-amber-700";
    case "low":
      return "text-green-700";
    default:
      return "text-gray-700";
  }
};

export const generateId = () => {
  return crypto.randomUUID();
};
