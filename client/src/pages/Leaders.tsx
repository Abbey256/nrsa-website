import React from "react";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Zap, UserCheck, MapPin } from "lucide-react";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";

interface Leader {
  id: number;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  order: number;
  state?: string;
}

const API_URL = "/api/leaders";

export default function Leaders() {
  const [, navigate] = useLocation();
  
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaders = async () => {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: Leader[] = await response.json();
            
            data.sort((a, b) => a.order - b.order);
            
            setLeaders(data);
            setError(null);
            
        } catch (e) {
            console.error("Error fetching leaders list:", e);
            setError("Could not load leadership data. Please check the API connection.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchLeaders();
  }, []);

  const handleReadBio = (leaderId: number) => {
    navigate(`/leaders/${leaderId}`);
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="ml-4 text-lg text-gray-600">Loading Leadership...</p>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center p-8 bg-red-50 border border-red-300 rounded-lg shadow-md">
          <p className="font-semibold text-red-700">Error Loading Data</p>
          <p className="text-sm text-red-600">{error}</p>
        </div>
      );
    }
    
    if (leaders.length === 0) {
        return (
            <div className="text-center p-12 bg-yellow-50 border border-yellow-300 rounded-lg shadow-md">
                <Zap className="w-8 h-8 text-yellow-600 mx-auto mb-4" />
                <p className="font-semibold text-xl text-yellow-700">No Leaders Found</p>
                <p className="mt-2 text-md text-yellow-600">Leader profiles will appear here once added in the admin dashboard.</p>
            </div>
        );
    }

    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leaders.map((leader) => (
          <Card 
            key={leader.id} 
            className="group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl border-t-8 border-primary/70 rounded-xl cursor-pointer hover-elevate active-elevate-2"
            onClick={() => handleReadBio(leader.id)}
          >
            <div className="h-48 w-full overflow-hidden bg-gray-100">
                <img 
                    src={leader.photoUrl} 
                    alt={`Photo of ${leader.name}`} 
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { 
                        (e.target as HTMLImageElement).onerror = null; 
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/009739/ffffff?text=NRSA"; 
                    }}
                />
            </div>
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-extrabold text-gray-900 leading-snug tracking-tight">{leader.name}</h3>
              
              <p className="text-primary font-semibold mt-1 text-md flex items-center justify-center gap-1 mb-3">
                <UserCheck className="w-4 h-4" />
                {leader.position}
              </p>
              
              {leader.state && (
                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground mb-3">
                    <MapPin className="w-4 h-4 text-primary" />
                    <span>{leader.state}</span>
                </div>
              )}

              {leader.bio && (
                  <div className="text-left pt-4 border-t space-y-3">
                    <div className="text-sm text-muted-foreground mb-1">About</div>
                    <p className="text-sm text-foreground/80 line-clamp-3">{leader.bio}</p>
                  </div>
              )}
              
              <div className="mt-4 text-primary font-semibold text-sm hover:underline">
                  Click for Full Bio
              </div>

            </CardContent>
          </Card>
        ))}
      </div>
    );
  };

  return (
    <>
      <Helmet>
        <title>Leadership Team - NRSA</title>
      </Helmet>
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Our Visionary Leaders</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Meet the dedicated team guiding the Nigerian Rope Skipping Association.
          </p>
        </div>
      </section>

      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {renderContent()}
        </div>
      </section>
    </>
  );
}
