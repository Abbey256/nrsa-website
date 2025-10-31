import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { AdminLayout } from "@/components/admin/AdminLayout";

import Home from "@/pages/Home";
import About from "@/pages/About";
import Competitions from "@/pages/Competitions";
import News from "@/pages/News";
import NewsDetail from "@/pages/NewsDetail";
import Events from "@/pages/Events";
import Players from "@/pages/Players";
import Clubs from "@/pages/Clubs";
import Leaders from "@/pages/Leaders";
import LeaderDetail from "@/pages/LeaderDetail";
import Memberstates from "@/pages/Memberstates";
import Media from "@/pages/Media";
import Contact from "@/pages/Contact";

import AdminDashboard from "@/pages/admin/Dashboard";
import AdminHeroSlides from "@/pages/admin/HeroSlides";
import AdminNews from "@/pages/admin/News";
import AdminEvents from "@/pages/admin/Events";
import AdminPlayers from "@/pages/admin/Players";
import AdminClubs from "@/pages/admin/Clubs";
import AdminLeaders from "@/pages/admin/Leaders";
import AdminMemberstates from "@/pages/admin/AdminMemberStates";
import AdminMedia from "@/pages/admin/Media";
import AdminAffiliations from "@/pages/admin/Affiliations";
import AdminContacts from "@/pages/admin/Contacts";
import AdminSettings from "@/pages/admin/Settings";
import AdminAdmins from "@/pages/admin/Admins";
import AdminLogin from "@/pages/admin/Login";

import NotFound from "@/pages/not-found";

function PageWithLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Switch>

            {/* Admin Routes */}
            <Route path="/admin/login" component={AdminLogin} />

            <Route path="/admin-nrsa-dashboard">
              <AdminLayout><AdminDashboard /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/hero-slides">
              <AdminLayout><AdminHeroSlides /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/news">
              <AdminLayout><AdminNews /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/events">
              <AdminLayout><AdminEvents /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/players">
              <AdminLayout><AdminPlayers /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/clubs">
              <AdminLayout><AdminClubs /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/leaders">
              <AdminLayout><AdminLeaders /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/member-states">
  <AdminLayout><Memberstates /></AdminLayout>
</Route>

            <Route path="/admin-nrsa-dashboard/media">
              <AdminLayout><AdminMedia /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/affiliations">
              <AdminLayout><AdminAffiliations /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/contacts">
              <AdminLayout><AdminContacts /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/admins">
              <AdminLayout><AdminAdmins /></AdminLayout>
            </Route>
            <Route path="/admin-nrsa-dashboard/settings">
              <AdminLayout><AdminSettings /></AdminLayout>
            </Route>

            {/* Public Routes */}
            <Route path="/">
              <PageWithLayout><Home /></PageWithLayout>
            </Route>
            <Route path="/about">
              <PageWithLayout><About /></PageWithLayout>
            </Route>
            <Route path="/competitions"> {/* added route right after /about */}
              <PageWithLayout><Competitions /></PageWithLayout>
            </Route>
            <Route path="/news">
              <PageWithLayout><News /></PageWithLayout>
            </Route>
            <Route path="/news/:id">
              {(params) => (
                <PageWithLayout>
                  <NewsDetail id={params.id} />
                </PageWithLayout>
              )}
            </Route>
            <Route path="/events">
              <PageWithLayout><Events /></PageWithLayout>
            </Route>
            <Route path="/players">
              <PageWithLayout><Players /></PageWithLayout>
            </Route>
            <Route path="/clubs">
              <PageWithLayout><Clubs /></PageWithLayout>
            </Route>
            <Route path="/leaders">
              <PageWithLayout><Leaders /></PageWithLayout>
            </Route>
            {/* Fixed Route: Pass id param to LeaderDetail */}
            <Route path="/leaders/:id">
              {(params) => (
                <PageWithLayout>
                  <LeaderDetail id={params.id} />
                </PageWithLayout>
              )}
            </Route>
            <Route path="/member-states">
              <PageWithLayout><Memberstates /></PageWithLayout>
            </Route>
            <Route path="/media">
              <PageWithLayout><Media /></PageWithLayout>
            </Route>
            <Route path="/contact">
              <PageWithLayout><Contact /></PageWithLayout>
            </Route>

            {/* Fallback */}
            <Route component={NotFound} />

          </Switch>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}