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
  user: {
    name: "example",
    email: "e@example.com",
    avatar: "",
  },
  navMain: [
    {
      title: "Apps",
      url: "",
      items: [
        {
          title: "API Keys",
          url: "next-admin/api-keys",
          isActive: false,
        },
        {
          title: "Calendar",
          url: "next-admin/calendar",
          isActive: false,
        },
        {
          title: "Chats",
          url: "next-admin/chats",
          isActive: false,
        },
        {
          title: "File Manager",
          url: "next-admin/file-manager",
          isActive: false,
        },
        {
          title: "Invoice",
          url: "next-admin/invoice",
          isActive: false,
        },
        {
          title: "Kanban Board",
          url: "next-admin/kanban-board",
          isActive: false,
        },
        {
          title: "Mail",
          url: "next-admin/mail",
          isActive: false,
        },
        {
          title: "Notes",
          url: "next-admin/notes",
          isActive: false,
        },
        {
          title: "Social Media",
          url: "next-admin/social-media",
          isActive: false,
        },
        {
          title: "To-Do",
          url: "next-admin/todo",
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
              <a href="/">
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
