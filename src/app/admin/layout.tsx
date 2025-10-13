import { AppSidebar } from "@/components/admin/AppSidebar";
import { DarkModeToggle } from "@/components/DarkModeToggle";
import {
  CalendarProvider,
  FileProvider,
  UnifiedAuthProvider,
} from "@/components/providers/Provider";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex px-3 border-b h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
          <SidebarTrigger className="-ml-1" />
          <Separator
            orientation="vertical"
            className="mr-2 data-[orientation=vertical]:h-4"
          />
          <div className="flex-1"></div>
          <DarkModeToggle />
        </header>
        <main className="p-4">
          <UnifiedAuthProvider>
            <CalendarProvider>
              <FileProvider>{children}</FileProvider>
            </CalendarProvider>
          </UnifiedAuthProvider>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
