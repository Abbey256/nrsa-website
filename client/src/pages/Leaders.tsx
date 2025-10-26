import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
// Corrected imports: use single '../' as pages is next to components/ui
import { Card, CardContent } from "../components/ui/card";
import { Skeleton } from "../components/ui/skeleton";
import { apiRequest } from "../lib/queryClient";
import type { Leader } from "@shared/schema";
import { MoveRight } from "lucide-react";

/**
 * Public Leaders Page
 * Displays the list of federation leaders managed via the admin panel.
 * * Features:
 * - Fetches data from /api/leaders
 * - Displays name, position, photo, and bio.
 * - Responsive grid layout that switches from 1, 2, or 3 columns based on screen size.
 * - Skeleton loader for a smooth user experience.
 */
export default function LeadersPage() {
  // Fetch leaders from API using the same key as the admin panel
  const { data: leaders, isLoading, isError } = useQuery<Leader[]>({
    queryKey: ["/api/leaders"],
  });

  const sortedLeaders = leaders?.sort((a, b) => a.order - b.order) || [];

  return (
    <div className="container py-12 md:py-20 animate-fade-in-up">
      <h1 className="text-4xl md:text-5xl font-extrabold text-[#009739] mb-4 border-b-4 border-b-red-600/50 pb-2 inline-block">
        Our Leadership
      </h1>
      <p className="text-lg text-gray-600 mb-10 max-w-3xl">
        Meet the dedicated individuals guiding the Nigeria Rope Skipping Association (NRSA) forward.
      </p>

      {/* --- Loading State --- */}
      {isLoading && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map(i => (
            <Card key={i} className="p-4 shadow-xl border-t-4 border-t-[#009739]/50">
              <CardContent className="p-0">
                <Skeleton className="w-full h-64 mb-4 rounded-lg" />
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-5/6" />
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* --- Error State --- */}
      {isError && (
        <div className="text-center p-10 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">
            Could not load leadership data. Please check the API connection.
          </p>
        </div>
      )}

      {/* --- Leaders Grid --- */}
      {!isLoading && !isError && sortedLeaders.length > 0 && (
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {sortedLeaders.map((leader) => (
            <Card 
              key={leader.id} 
              className="relative p-6 transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-t-4 border-t-[#009739]"
            >
              <CardContent className="p-0">
                {leader.photoUrl && (
                  <div className="h-64 mb-4 overflow-hidden rounded-lg">
                    <img
                      src={leader.photoUrl}
                      alt={leader.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      // Fallback for broken images
                      onError={(e) => { 
                        e.currentTarget.onerror = null; 
                        e.currentTarget.src = 'https://placehold.co/600x400/009739/FFFFFF?text=NRSA+Leader';
                      }}
                    />
                  </div>
                )}
                
                <h2 className="text-2xl font-bold text-gray-900 mb-1">{leader.name}</h2>
                <p className="text-base font-semibold text-red-600 mb-3 uppercase tracking-wider">{leader.position}</p>
                
                {leader.bio && (
                  <p className="text-gray-700 text-sm italic line-clamp-3">
                    {leader.bio}
                  </p>
                )}
                <Link href={`/leader/${leader.id}`} className="mt-4 inline-flex items-center text-[#009739] font-medium hover:text-red-600 transition-colors">
                    Read More 
                    <MoveRight className="w-4 h-4 ml-2" />
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {!isLoading && !isError && sortedLeaders.length === 0 && (
        <div className="text-center p-10 bg-gray-50 border border-gray-200 rounded-lg">
          <p className="text-gray-600">
            No leaders are currently listed. Please check back later.
          </p>
        </div>
      )}
    </div>
  );
}