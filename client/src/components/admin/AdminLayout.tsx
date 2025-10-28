import { Link, useLocation } from "wouter";
import { useEffect } from "react";
import { 
  LayoutDashboard, 
  Settings, 
  Home as HomeIcon, 
  Newspaper, 
  Calendar, 
  Users, 
  Trophy, 
  Image as ImageIcon, 
  Link as LinkIcon, 
  Mail, 
  LogOut,
  ShieldCheck
} from "lucide-react";
import { Button } from "@/components/ui/button";
import logoUrl from "@assets/nrsf-logo_1761313307811.jpg";

interface AdminLayoutProps {
  children: React.ReactNode;
}

/**
 * AdminLayout Component
 * 
 * Provides the admin dashboard layout with:
 * - JWT authentication check: Redirects to login if no token is found
 * - Sidebar navigation with all admin sections
 * - Logout functionality that clears the JWT token
 * 
 * Authentication Flow:
 * 1. On mount, checks for 'adminToken' in localStorage
 * 2. If no token exists, redirects to /admin/login
 * 3. Token is set after successful login (see Login.tsx)
 * 4. Token is sent with API requests via Authorization header (see individual admin pages)
 */
export function AdminLayout({ children }: AdminLayoutProps) {
  const [location] = useLocation();

  // JWT Authentication Check - runs on component mount
  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      // No token found, redirect to login page
      window.location.href = "/admin/login";
    }
  }, []);

  // Logout handler: removes JWT token and admin info, redirects to home page
  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    window.location.href = "/";
  };

  const navItems = [
    { label: "Dashboard", path: "/admin-nrsa-dashboard", icon: LayoutDashboard },
    { label: "Hero Slides", path: "/admin-nrsa-dashboard/hero-slides", icon: HomeIcon },
    { label: "News", path: "/admin-nrsa-dashboard/news", icon: Newspaper },
    { label: "Events", path: "/admin-nrsa-dashboard/events", icon: Calendar },
    { label: "Players", path: "/admin-nrsa-dashboard/players", icon: Users },
    { label: "Clubs", path: "/admin-nrsa-dashboard/clubs", icon: Trophy },
    { label: "Leaders", path: "/admin-nrsa-dashboard/leaders", icon: Users },
    { label: "Media", path: "/admin-nrsa-dashboard/media", icon: ImageIcon },
    { label: "Affiliations", path: "/admin-nrsa-dashboard/affiliations", icon: LinkIcon },
    { label: "Contact Messages", path: "/admin-nrsa-dashboard/contacts", icon: Mail },
    { label: "Manage Admins", path: "/admin-nrsa-dashboard/admins", icon: ShieldCheck },
    { label: "Site Settings", path: "/admin-nrsa-dashboard/settings", icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-muted/20">
      {/* Sidebar */}
      <aside className="w-72 bg-primary text-primary-foreground flex flex-col">
        {/* Logo */}
        <div className="p-6 border-b border-primary-foreground/10">
          <div className="flex items-center gap-3">
            <img src={logoUrl} alt="NRSA Logo" className="h-12 w-auto" />
            <div>
              <div className="font-bold text-lg">NRSA</div>
              <div className="text-xs opacity-90">Admin Panel</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-1">
          {navItems.map((item) => {
            const isActive = location === item.path;
            return (
              <Link key={item.path} href={item.path} data-testid={`link-admin-${item.label.toLowerCase().replace(/\s+/g, '-')}`}>
                <div
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-md cursor-pointer
                    transition-all
                    ${isActive 
                      ? "bg-primary-foreground/20 border-l-4 border-white" 
                      : "hover-elevate active-elevate-2"
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Logout */}
        <div className="p-4 border-t border-primary-foreground/10">
          <Button 
            variant="destructive" 
            className="w-full justify-start gap-3"
            onClick={handleLogout}
            data-testid="button-logout"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto">
        {/* Top Bar */}
        <header className="bg-white border-b px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              Admin Portal / {navItems.find(item => item.path === location)?.label || "Dashboard"}
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-medium">Administrator</span>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
