export const dynamic = 'force-dynamic';
import React from "react";

// Force cache bust - update this timestamp when deploying
const BUILD_TIMESTAMP = Date.now();
import { HeroCarousel } from "@/components/HeroCarousel";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, Users, Trophy, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero Carousel */}
      <HeroCarousel />

      {/* About Section */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            
            {/* Text Content */}
            <div className="lg:col-span-3">
              <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                About the <span className="text-primary">Association</span>
              </h2>

              <div className="space-y-6 text-foreground/80 leading-relaxed">
                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our Mission</h3>
                  <p className="text-lg">
                    To promote, develop, and regulate rope skipping across Nigeria, fostering athletic 
                    excellence and providing opportunities for all Nigerians to participate in this dynamic sport.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our Vision</h3>
                  <p className="text-lg">
                    To establish Nigeria as a leading force in international rope skipping, producing world-class 
                    athletes and hosting premier competitions that showcase Nigerian talent.
                  </p>
                </div>

                <div>
                  <h3 className="text-2xl font-semibold text-primary mb-3">Our History</h3>
                  <p className="text-lg">
                    Established as Nigeria's official governing body for rope skipping, NRSA has been instrumental 
                    in developing the sport from grassroots to elite levels across all 36 states.
                  </p>
                </div>
              </div>

              <Link href="/about">
                <Button className="mt-8 bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg">
                  Learn More <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </Link>
            </div>

            {/* Affiliations */}
            <div className="lg:col-span-2">
              <Card className="border-primary/20">
                <CardHeader>
                  <CardTitle className="text-primary text-center">International Affiliations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-8">
                  
                  {/* IJRU */}
                  <div className="text-center">
                    <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg mb-4">
                      <div className="text-3xl font-bold text-primary">IJRU</div>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">International Jump Rope Union</h4>
                    <p className="text-sm text-muted-foreground">
                      Global governing body setting international standards for rope skipping.
                    </p>
                    <a 
                      href="https://ijru.sport" 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-block mt-3 text-primary text-sm hover:underline"
                    >
                      Visit IJRU.sport →
                    </a>
                  </div>

                  {/* IRSO */}
                  <div className="border-t pt-6 text-center">
                    <div className="inline-block px-6 py-3 bg-primary/10 rounded-lg mb-4">
                      <div className="text-3xl font-bold text-primary">IRSO</div>
                    </div>
                    <h4 className="font-semibold text-lg mb-2">International Rope Skipping Organization</h4>
                    <p className="text-sm text-muted-foreground">
                      Promoting rope skipping as a competitive global sport.
                    </p>
                  </div>

                  <div className="bg-primary/5 p-4 rounded-lg text-center">
                    <span className="inline-block px-4 py-2 bg-primary text-primary-foreground rounded-full text-sm font-semibold">
                      ✓ Proud Member
                    </span>
                  </div>

                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Explore NRSA</h2>
          {/* Cache bust indicator - remove after confirming */}
          <div className="text-center mb-4 text-xs text-muted-foreground">
            Version: 4-CARDS-FIX-{Date.now()}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

            {/* Latest News */}
            <Link href="/news">
              <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Calendar className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Latest News</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Stay updated with competition highlights and national announcements.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* Player Rankings */}
            <a
              href="https://skippers.nrsa.com.ng"
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Users className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Player Rankings</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Track national rankings and performance stats across Nigeria.
                  </p>
                </CardContent>
              </Card>
            </a>

            {/* Events */}
            <Link href="/events">
              <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <Trophy className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">Upcoming Events</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Explore championships, camps, and national competitions.
                  </p>
                </CardContent>
              </Card>
            </Link>

            {/* About NRSA */}
            <Link href="/about">
              <Card className="cursor-pointer hover-elevate active-elevate-2 transition-all h-full">
                <CardHeader>
                  <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4">
                    <ChevronRight className="w-6 h-6 text-primary" />
                  </div>
                  <CardTitle className="text-2xl">About NRSA</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Learn more about our structure, leadership, and national programs.
                  </p>
                </CardContent>
              </Card>
            </Link>

          </div>
        </div>
      </section>
    </div>
  );
}