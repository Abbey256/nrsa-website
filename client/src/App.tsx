import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/admin/AdminLayout";
import Home from "@/pages/Home";
import About from "@/pages/About";
import News from "@/pages/News";
import Events from "@/pages/Events";
import Players from "@/pages/Players";
import Clubs from "@/pages/Clubs";
import Leaders from "@/pages/Leaders"; // <-- NEW: Import the public Leaders page
import Media from "@/pages/Media";
import Contact from "@/pages/Contact";
import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHeroSlides from "@/pages/admin/HeroSlides";
import AdminNews from "@/pages/admin/News";
import AdminEvents from "@/pages/admin/Events";
import AdminPlayers from "@/pages/admin/Players";
import AdminClubs from "@/pages/admin/Clubs";
import AdminLeaders from "@/pages/admin/Leaders";
import AdminMedia from "@/pages/admin/Media";
import AdminAffiliations from "@/pages/admin/Affiliations";
import AdminContacts from "@/pages/admin/Contacts";
import AdminSettings from "@/pages/admin/Settings";
import AdminLogin from "@/pages/admin/Login";
import NotFound from "@/pages/not-found";

/**
 * Wrapper component for public-facing pages with Header and Footer
 */
function PageWithLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

/**
 * Main application component with routing configuration.
 * Routes are ordered by priority: admin routes first, then public routes, then 404.
 *  * Routing Fix:
 * - Admin routes are now explicitly defined at the top level with exact paths
 * - This ensures that /admin-nrsa-dashboard properly loads the Dashboard component
 * - JWT authentication is checked in AdminLayout component (redirects to login if no token)
 * - All admin routes use the AdminLayout wrapper which includes the sidebar navigation
 */
export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Admin Login Route (no layout, public access) */}
          <Route path="/admin/login" component={AdminLogin} />
          
          {/* Admin Dashboard Routes - All routes explicitly defined with AdminLayout wrapper */}
          {/* These routes require JWT authentication (checked in AdminLayout) */}
          <Route path="/admin-nrsa-dashboard">
            {() => <AdminLayout><AdminDashboard /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/hero-slides">
            {() => <AdminLayout><AdminHeroSlides /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/news">
            {() => <AdminLayout><AdminNews /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/events">
            {() => <AdminLayout><AdminEvents /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/players">
            {() => <AdminLayout><AdminPlayers /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/clubs">
            {() => <AdminLayout><AdminClubs /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/leaders">
            {() => <AdminLayout><AdminLeaders /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/media">
            {() => <AdminLayout><AdminMedia /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/affiliations">
            {() => <AdminLayout><AdminAffiliations /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/contacts">
            {() => <AdminLayout><AdminContacts /></AdminLayout>}
          </Route>
          <Route path="/admin-nrsa-dashboard/settings">
            {() => <AdminLayout><AdminSettings /></AdminLayout>}
          </Route>
          
          {/* Public Routes (with header and footer) */}
          <Route path="/">
            {() => <PageWithLayout><Home /></PageWithLayout>}
          </Route>
          <Route path="/about">
            {() => <PageWithLayout><About /></PageWithLayout>}
          </Route>
          <Route path="/news">
            {() => <PageWithLayout><News /></PageWithLayout>}
          </Route>
          <Route path="/events">
            {() => <PageWithLayout><Events /></PageWithLayout>}
          </Route>
          <Route path="/players">
            {() => <PageWithLayout><Players /></PageWithLayout>}
          </Route>
          <Route path="/clubs">
            {() => <PageWithLayout><Clubs /></PageWithLayout>}
          </Route>
          <Route path="/leaders"> {/* <-- NEW: Leaders Public Route */}
            {() => <PageWithLayout><Leaders /></PageWithLayout>}
          </Route>
          <Route path="/media">
            {() => <PageWithLayout><Media /></PageWithLayout>}
          </Route>
          <Route path="/contact">
            {() => <PageWithLayout><Contact /></PageWithLayout>}
          </Route>
          
          {/* 404 Catch-all */}
          <Route component={NotFound} />
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
