import React, { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Loader2, ArrowLeft, UserCheck } from "lucide-react";
import { useRoute, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

// --- Type Definitions (matching the admin data structure) ---
interface Leader {
  id: string;
  name: string;
  position: string; 
  bio: string;
  photoUrl: string;
}

// NOTE: All Firebase/Firestore imports and setup have been removed,
// as the Admin component confirms the data source is a standard REST API.

export default function LeaderDetail() {
  // 1. Get ID from URL and navigation function
  const [match, params] = useRoute("/leaders/:id");
  const [, navigate] = useLocation();
  const leaderId = params?.id || null;

  // 2. State management
  const [leader, setLeader] = useState<Leader | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 3. Data Fetching Effect (using standard API fetch)
  useEffect(() => {
    if (!leaderId) {
      setIsLoading(false);
      setError("Invalid leader ID provided in the URL.");
      return;
    }
    
    setIsLoading(true);
    setError(null);

    // Fetch data from the standard API endpoint, consistent with the Admin portal
    const fetchLeader = async () => {
      try {
        const apiUrl = `/api/leaders/${leaderId}`;
        console.log(`Fetching leader from: ${apiUrl}`);

        const response = await fetch(apiUrl);
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data) {
            const fetchedLeader: Leader = {
                id: data.id,
                name: data.name || "Untitled Leader",
                position: data.position || "Position Pending",
                bio: data.bio || "No biography provided.",
                photoUrl: data.photoUrl || "https://placehold.co/600x600/009739/ffffff?text=NRSA", 
            };
            setLeader(fetchedLeader);
        } else {
            setError(`Leader with ID ${leaderId} not found.`);
        }
        
      } catch (e) {
        console.error("Error fetching leader profile:", e);
        setError("Could not load leader profile. Please check the API connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeader();

  }, [leaderId]); 

  // 4. Render States
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen -mt-20">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="ml-4 text-xl text-gray-600">Loading Leader Profile...</p>
      </div>
    );
  }

  if (error || !leader) {
    return (
      <div className="text-center p-20 bg-gray-50">
        <h1 className="text-4xl font-bold text-red-600">Error</h1>
        <p className="mt-4 text-xl text-gray-600">{error || "Leader not found."}</p>
        <Button onClick={() => navigate("/leaders")} className="mt-8 bg-primary hover:bg-primary/90">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leaders
        </Button>
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>{leader.name} - NRSA Leadership</title>
      </Helmet>
      
      <div className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <Button 
            variant="ghost" 
            onClick={() => navigate("/leaders")} 
            className="mb-8 text-primary hover:bg-primary/10 transition-all duration-300 font-semibold"
          >
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Leadership Team
          </Button>

          <Card className="p-8 md:p-12 shadow-2xl rounded-xl">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
              
              {/* Leader Photo Section */}
              <div className="lg:col-span-1">
                <img 
                  src={leader.photoUrl} 
                  alt={`Photo of ${leader.name}`} 
                  className="w-full h-auto object-cover rounded-lg shadow-xl aspect-square border-4 border-primary/20"
                  onError={(e) => { 
                    (e.target as HTMLImageElement).onerror = null; 
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x600/009739/ffffff?text=NRSA"; 
                  }}
                />
              </div>

              {/* Leader Bio and Details Section */}
              <div className="lg:col-span-2">
                <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 mb-2">{leader.name}</h1>
                <p className="text-2xl font-semibold text-primary mb-6 flex items-center gap-2">
                    <UserCheck className="w-6 h-6" />
                    {leader.position}
                </p>

                <div className="prose prose-lg max-w-none text-gray-700">
                    <h2 className="text-3xl font-bold text-gray-800 border-b border-primary/50 pb-2 mb-6 mt-6">Full Biography</h2>
                    {/* Display bio. Splitting by newline for clean paragraph breaks */}
                    {leader.bio.split('\n').map((paragraph, index) => (
                        <p key={index} className="mb-4 leading-relaxed">{paragraph}</p>
                    ))}
                    
                    {/* Optional footer */}
                    <p className="mt-10 text-sm italic text-gray-500 border-t pt-4">
                        The leadership of the NRSA is committed to advancing the sport of rope skipping in Nigeria.
                    </p>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}