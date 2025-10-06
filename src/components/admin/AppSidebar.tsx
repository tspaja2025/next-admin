import { GalleryVerticalEnd } from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarRail,
} from "@/components/ui/sidebar";

const data = {
  navMain: [
    {
      title: "Apps",
      url: "",
      items: [
        {
          title: "Kanban Board",
          url: "/admin/kanban-board",
          isActive: false,
        },
        {
          title: "Notes",
          url: "/admin/notes",
          isActive: false,
        },
        {
          title: "Chats",
          url: "/admin/chats",
          isActive: false,
        },
        {
          title: "Social Media",
          url: "/admin/social-media",
          isActive: false,
        },
        {
          title: "Mail",
          url: "/admin/mail",
          isActive: false,
        },
        {
          title: "To-Do",
          url: "/admin/todo",
          isActive: false,
        },
        {
          title: "Tasks",
          url: "/admin/tasks",
          isActive: false,
        },
        {
          title: "File Manager",
          url: "/admin/file-manager",
          isActive: false,
        },
        {
          title: "Invoice",
          url: "/admin/invoice",
          isActive: false,
        },
        {
          title: "API Keys",
          url: "/admin/api-keys",
          isActive: false,
        },
        {
          title: "Courses",
          url: "/admin/courses",
          isActive: false,
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <a href="/admin">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Next Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu>
            {data.navMain.map((item) => (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton asChild>
                  <a href={item.url} className="font-bold">
                    {item.title}
                  </a>
                </SidebarMenuButton>
                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((item) => (
                      <SidebarMenuSubItem key={item.title}>
                        <SidebarMenuSubButton asChild isActive={item.isActive}>
                          <a href={item.url}>{item.title}</a>
                        </SidebarMenuSubButton>
                      </SidebarMenuSubItem>
                    ))}
                  </SidebarMenuSub>
                ) : null}
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
