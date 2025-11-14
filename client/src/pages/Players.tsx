import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy, MapPin } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useQuery } from "@tanstack/react-query";
import type { Player } from "@shared/schema";

export default function Players() {
  const { data: players = [], isLoading, error } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });
  
  console.log('🔍 [PLAYERS FRONTEND] Render state:', { playersCount: players.length, isLoading, error });

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Athletes</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Meet Nigeria's top rope skipping athletes representing the nation in competitions worldwide.
          </p>
        </div>
      </section>

      {/* Players Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading athletes...</p>
            </div>
          ) : error ? (
            <div className="text-center py-20">
              <p className="text-red-600 text-lg">Failed to load athletes. Please try again later.</p>
            </div>
          ) : players.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">No athletes registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {players.map((player) => (
              <Card 
                key={player.id} 
                className="hover-elevate active-elevate-2 cursor-pointer transition-all text-center"
                data-testid={`card-player-${player.id}`}
              >
                <CardContent className="pt-8 space-y-4">
                  <div className="relative inline-block">
                    <Avatar className="w-24 h-24 mx-auto border-4 border-primary/20">
                      <AvatarImage src={player.photoUrl || undefined} alt={player.name || 'Player'} />
                      <AvatarFallback className="bg-primary/10 text-primary text-2xl font-bold">
                        {(player.name || 'P').split(' ').map(n => n[0] || '').join('').slice(0, 2) || 'P'}
                      </AvatarFallback>
                    </Avatar>
                  </div>

                  <div>
                    <h3 className="font-bold text-xl text-foreground mb-1">{player.name || 'Unknown Player'}</h3>
                    <Badge variant="secondary" className="mb-2">{player.category || 'Uncategorized'}</Badge>
                  </div>

                  <div className="space-y-2 text-sm">
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <Trophy className="w-4 h-4 text-primary" />
                      <span className="font-semibold text-foreground">{player.club || 'No Club'}</span>
                    </div>
                    <div className="flex items-center justify-center gap-2 text-muted-foreground">
                      <MapPin className="w-4 h-4 text-primary" />
                      <span>{player.state || 'Unknown State'}</span>
                    </div>
                  </div>

                  <div className="pt-4 border-t space-y-3">
                    <div>
                      <div className="text-sm text-muted-foreground mb-1">Total Points</div>
                      <div className="text-2xl font-bold text-primary">{player.totalPoints || 0}</div>
                    </div>
                    
                    {(player.awardsWon !== undefined && player.awardsWon !== null && player.awardsWon > 0) && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Awards Won</div>
                        <div className="text-lg font-semibold text-foreground">{player.awardsWon}</div>
                      </div>
                    )}
                    
                    {(player.gamesPlayed !== undefined && player.gamesPlayed !== null && player.gamesPlayed > 0) && (
                      <div>
                        <div className="text-sm text-muted-foreground mb-1">Games Played</div>
                        <div className="text-lg font-semibold text-foreground">{player.gamesPlayed}</div>
                      </div>
                    )}
                    
                    {player.biography && (
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground mb-1">About</div>
                        <p className="text-sm text-foreground/80 line-clamp-3">{player.biography}</p>
                      </div>
                    )}
                    
                    {player.achievements && (
                      <div className="text-left">
                        <div className="text-sm text-muted-foreground mb-1">Achievements</div>
                        <p className="text-sm text-foreground/80 line-clamp-2">{player.achievements}</p>
                      </div>
                    )}
                  </div>
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
