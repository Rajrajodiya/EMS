import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  Building,
  Users,
  Plane,
  Settings,
  User,
  LogOut,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/services/api";
import { API_ENDPOINTS } from "@/config";

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Departments",
    url: "/departments",
    icon: Building,
  },
  {
    title: "Employee List",
    url: "/employees",
    icon: Users,
  },
  {
    title: "Leaves",
    url: "/leaves",
    icon: Plane,
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
  },
];

export function AppSidebar() {
  const location = useLocation();
  const { user, logout, updateUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [avatarUrl, setAvatarUrl] = useState("https://github.com/shadcn.png");

  // Load user data from API if needed
  useEffect(() => {
    const loadUserData = async () => {
      try {
        if (user && (!user.name || !user.avatarUrl)) {
          const response = await api.get(API_ENDPOINTS.AUTH.PROFILE);
          if (response.data) {
            const updatedUser = {
              ...user,
              name: response.data.name || user.name,
              avatarUrl: response.data.avatar || user.avatarUrl,
            };
            updateUser(updatedUser);
            if (response.data.avatar) {
              setAvatarUrl(response.data.avatar);
            }
          }
        }
      } catch (error) {
        console.error("Failed to load user data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      loadUserData();
    } else {
      setLoading(false);
    }
  }, [user, updateUser]);

  if (loading) {
    return (
      <Sidebar className="border-r border-border bg-background flex flex-col justify-between">
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3">
            <div className="h-9 w-9 rounded-full bg-muted animate-pulse" />
            <div className="space-y-2">
              <div className="h-4 w-24 bg-muted rounded animate-pulse" />
              <div className="h-3 w-32 bg-muted rounded animate-pulse" />
            </div>
          </div>
        </div>
      </Sidebar>
    );
  }

  const userName = user?.name || user?.email || "User";
  const userEmail = user?.email || "user@example.com";

  return (
    <Sidebar className="border-r border-border bg-background flex flex-col justify-between">
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 py-3 my-2.5 text-lg font-semibold tracking-wide text-muted-foreground">
            Employee Management
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(({ title, url, icon: Icon }) => (
                <SidebarMenuItem key={title}>
                  <SidebarMenuButton asChild isActive={location.pathname === url}>
                    <Link
                      to={url}
                      className="flex items-center gap-3 px-4 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md transition-colors"
                    >
                      <Icon className="w-5 h-5" />
                      <span>{title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User Profile Section */}
      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              className="w-full flex items-center gap-3 rounded-md px-3 py-2 hover:bg-accent transition"
              aria-label="User menu"
            >
              <Avatar className="h-9 w-9">
                <AvatarImage
                  src={avatarUrl}
                  alt="User avatar"
                />
                <AvatarFallback>
                  {userName
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .toUpperCase()
                    .slice(0, 2) || "US"}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start text-left overflow-hidden">
                <p className="text-sm font-medium truncate max-w-[160px]">
                  {userName}
                </p>
                <p className="text-xs text-muted-foreground truncate max-w-[160px]">
                  {userEmail}
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56" align="end" side="top">
            <DropdownMenuItem asChild>
              <Link
                to="/profile"
                className="flex items-center w-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400 focus:bg-red-50 dark:focus:bg-red-900/20"
              onClick={logout}
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </Sidebar>
  );
}

export default AppSidebar;
