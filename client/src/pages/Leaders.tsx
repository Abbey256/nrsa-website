import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, Zap, UserCheck } from "lucide-react";
import { useRoute } from "wouter"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// --- Type Definitions (matching the admin data structure) ---
interface Leader {
  id: string;
  name: string;
  position: string; 
  bio: string;
  photoUrl: string;
}

// NOTE: All Firebase/Firestore logic has been removed to align with the Admin API structure.
const API_URL = "/api/leaders";

export default function Leaders() {
  // CORRECT: Use useRoute to get the navigate function for programmatic navigation
  // We don't need the match or params, just the navigate function
  const [, , navigate] = useRoute("/leaders/:id"); 
  
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Data Fetching Effect (using standard API fetch)
  useEffect(() => {
    const fetchLeaders = async () => {
        try {
            const response = await fetch(API_URL);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            const data: Leader[] = await response.json();
            
            // Assuming the API returns a list, and we sort it based on the 'order' field from the Admin portal.
            data.sort((a, b) => a.order - b.order); 
            
            setLeaders(data);
            setError(null);
            
        } catch (e) {
            console.error("Error fetching leaders list:", e);
            setError("Could not load leadership data.");
        } finally {
            setIsLoading(false);
        }
    };

    fetchLeaders();
  }, []); 

  const handleReadBio = (leaderId: string) => {
    // Programmatic navigation to the dedicated leader detail page
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {leaders.map((leader) => (
          <Card 
            key={leader.id} 
            className="group overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl border-t-8 border-primary/70 rounded-xl"
          >
            <div className="h-64 w-full overflow-hidden bg-gray-100">
                <img 
                    src={leader.photoUrl} 
                    alt={`Photo of ${leader.name}`} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    onError={(e) => { 
                        (e.target as HTMLImageElement).onerror = null; 
                        (e.target as HTMLImageElement).src = "https://placehold.co/400x400/009739/ffffff?text=NRSA"; 
                    }}
                />
            </div>
            <CardContent className="pt-6 text-center">
              <h3 className="text-xl font-extrabold text-gray-900 leading-snug tracking-tight">{leader.name}</h3>
              <p className="text-primary font-semibold mt-1 text-md flex items-center justify-center gap-1">
                <UserCheck className="w-4 h-4" />
                {leader.position}
              </p>
              
              <Button 
                variant="outline" 
                className="mt-4 w-full bg-primary text-white hover:bg-primary/90 hover:text-white"
                onClick={() => handleReadBio(leader.id)}
              >
                Read Bio
              </Button>
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
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          {/* Header Section */}
          <div className="text-center mb-16">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              <span className="text-primary">Meet</span> Our Visionary Leaders
            </h1>
            <p className="mt-4 max-w-3xl mx-auto text-xl text-gray-600">
              The Nigerian Rope Skipping Association is guided by a dedicated team ensuring the growth and success of the sport nationwide.
            </p>
          </div>
          
          {/* Leaders Grid/Content */}
          {renderContent()}
        </div>
      </div>
    </>
  );
}