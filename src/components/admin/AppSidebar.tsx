import { GalleryVerticalEnd } from "lucide-react";
import Link from "next/link";
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
        { title: "API Keys", url: "/api-keys", isActive: false },
        { title: "Calendar", url: "/calendar", isActive: false },
        { title: "Chats", url: "/chats", isActive: false },
        { title: "File Manager", url: "/file-manager", isActive: false },
        { title: "Invoice", url: "/invoice", isActive: false },
        { title: "Kanban Board", url: "/kanban-board", isActive: false },
        { title: "Mail", url: "/mail", isActive: false },
        { title: "Notes", url: "/notes", isActive: false },
        { title: "Social Media", url: "/social-media", isActive: false },
        { title: "To-Do", url: "/todo", isActive: false },
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
              <Link href="/">
                <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-medium">Next Admin</span>
                  <span className="">v1.0.0</span>
                </div>
              </Link>
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
                  <Link href={item.url} className="font-bold">
                    {item.title}
                  </Link>
                </SidebarMenuButton>

                {item.items?.length ? (
                  <SidebarMenuSub>
                    {item.items.map((subItem) => (
                      <SidebarMenuSubItem key={subItem.title}>
                        <SidebarMenuSubButton
                          asChild
                          isActive={subItem.isActive}
                        >
                          <Link href={subItem.url}>{subItem.title}</Link>
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
