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
import NotFound from "@/pages/not-found";

function PublicRoutes() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/about" component={About} />
          <Route path="/news" component={News} />
          <Route path="/events" component={Events} />
          <Route path="/players" component={Players} />
          <Route path="/clubs" component={Clubs} />
          <Route path="/media" component={Media} />
          <Route path="/contact" component={Contact} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function AdminRoutes() {
  return (
    <AdminLayout>
      <Switch>
        <Route path="/admin-nrsa-dashboard" component={AdminDashboard} />
        <Route path="/admin-nrsa-dashboard/hero-slides" component={AdminHeroSlides} />
        <Route path="/admin-nrsa-dashboard/news" component={AdminNews} />
        <Route path="/admin-nrsa-dashboard/events" component={AdminEvents} />
        <Route path="/admin-nrsa-dashboard/players" component={AdminPlayers} />
        <Route path="/admin-nrsa-dashboard/clubs" component={AdminClubs} />
        <Route path="/admin-nrsa-dashboard/leaders" component={AdminLeaders} />
        <Route path="/admin-nrsa-dashboard/media" component={AdminMedia} />
        <Route path="/admin-nrsa-dashboard/affiliations" component={AdminAffiliations} />
        <Route path="/admin-nrsa-dashboard/contacts" component={AdminContacts} />
        <Route path="/admin-nrsa-dashboard/settings" component={AdminSettings} />
      </Switch>
    </AdminLayout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Switch>
          {/* Admin Routes */}
          <Route path="/admin-nrsa-dashboard/:rest*">
            {() => <AdminRoutes />}
          </Route>
          
          {/* Public Routes */}
          <Route>
            {() => <PublicRoutes />}
          </Route>
        </Switch>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
