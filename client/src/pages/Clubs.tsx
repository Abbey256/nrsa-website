import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, User, Phone, Mail } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import type { Club } from "@shared/schema";

export default function Clubs() {
  const { data: clubs = [], isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Registered Clubs</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Discover rope skipping clubs across Nigeria, building communities and developing champions.
          </p>
        </div>
      </section>

      {/* Clubs Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading clubs...</p>
            </div>
          ) : clubs.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No registered clubs yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {clubs.map((club) => (
              <Card 
                key={club.id} 
                className="hover-elevate active-elevate-2 transition-all h-full flex flex-col"
                data-testid={`card-club-${club.id}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4 mb-4">
                    <div className="w-16 h-16 bg-primary/10 rounded-lg flex items-center justify-center">
                      <span className="text-3xl font-bold text-primary">
                        {club.name.charAt(0)}
                      </span>
                    </div>
                    {club.isRegistered && (
                      <Badge className="bg-primary text-primary-foreground">Registered</Badge>
                    )}
                  </div>
                  <CardTitle className="text-2xl">{club.name}</CardTitle>
                </CardHeader>
                <CardContent className="flex-grow space-y-4">
                  <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-foreground">{club.city}, {club.state}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-primary flex-shrink-0" />
                      <div>
                        <div className="text-xs text-muted-foreground">Manager</div>
                        <div className="font-medium text-foreground">{club.managerName}</div>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <Mail className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground break-all">{club.contactEmail}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{club.contactPhone}</span>
                    </div>
                  </div>

                  <Button 
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" 
                    data-testid={`button-contact-${club.id}`}
                  >
                    Contact Club
                  </Button>
                </CardContent>
              </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
