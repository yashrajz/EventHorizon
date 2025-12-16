import { SidebarProvider, Sidebar, SidebarHeader, SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton, SidebarSeparator, SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { Calendar, BarChart3, Cog, Users, Ticket, Layers } from "lucide-react";
import { Link, NavLink, Outlet } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

const AdminLayout = () => {
  const { user, signOut } = useAdminAuth();
  return (
    <SidebarProvider>
      <Sidebar collapsible="icon" variant="inset">
        <SidebarHeader>
          <div className="flex items-center gap-2 px-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-accent">
              <Calendar className="h-4 w-4 text-accent-foreground" />
            </div>
            <span className="font-display text-lg font-bold">Admin</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Management</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/admin" end>
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <BarChart3 />
                      <span>Dashboard</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/admin/events">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <Layers />
                      <span>Events</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/admin/registrations">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <Ticket />
                      <span>Registrations</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <NavLink to="/admin/users">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <Users />
                      <span>Users</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupLabel>System</SidebarGroupLabel>
            <SidebarMenu>
              <SidebarMenuItem>
                <NavLink to="/admin/settings">
                  {({ isActive }) => (
                    <SidebarMenuButton isActive={isActive}>
                      <Cog />
                      <span>Settings</span>
                    </SidebarMenuButton>
                  )}
                </NavLink>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroup>
        </SidebarContent>
        <SidebarFooter>
          <div className="px-2 text-xs text-muted-foreground">
            {user ? <span>{user.name} • {user.role}</span> : <Link to="/admin/login">Sign In</Link>}
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset className="min-h-screen">
        <div className="border-b border-glass-border bg-glass/40 backdrop-blur-xl">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SidebarTrigger />
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground">Back to site</Link>
            </div>
            {user && (
              <Button variant="ghost" size="sm" onClick={signOut}>Sign Out</Button>
            )}
          </div>
        </div>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
};

export default AdminLayout;

