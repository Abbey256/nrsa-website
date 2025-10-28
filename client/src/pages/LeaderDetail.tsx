import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useRoute, useLocation } from "wouter";
import { Loader2, ArrowLeft, UserCheck, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface Leader {
  id: number;
  name: string;
  position: string;
  bio: string;
  photoUrl: string;
  state?: string;
}

export default function LeaderDetail() {
  const [match, params] = useRoute("/leaders/:id");
  const [, navigate] = useLocation();
  const leaderId = params?.id ? Number(params.id) : null;

  const [leader, setLeader] = useState<Leader | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!leaderId) { setError("Invalid leader ID"); setIsLoading(false); return; }
    const fetchLeader = async () => {
      try {
        const res = await fetch(`/api/leaders/${leaderId}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Leader = await res.json();
        setLeader({
          ...data,
          photoUrl: data.photoUrl || "https://placehold.co/600x600/009739/ffffff?text=NRSA",
          bio: data.bio || "No biography provided.",
        });
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Could not load leader profile. Please check the API connection.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchLeader();
  }, [leaderId]);

  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-10 h-10 animate-spin text-primary" /></div>;
  if (error || !leader) return <div className="p-12 text-center text-red-700">{error || "Leader not found."}<Button onClick={() => navigate("/leaders")}>Back</Button></div>;

  return (
    <>
      <Helmet><title>{leader.name} - Leadership</title></Helmet>
      <div className="py-16 max-w-7xl mx-auto px-6 lg:px-8">
        <Button variant="ghost" onClick={() => navigate("/leaders")} className="mb-8"><ArrowLeft className="w-4 h-4 mr-2"/>Back to Leaders</Button>
        <Card className="p-8 md:p-12 shadow-2xl rounded-xl">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <img src={leader.photoUrl} alt={leader.name} className="w-full h-auto object-cover rounded-lg shadow-xl aspect-square border-4 border-primary/20"/>
            <div className="lg:col-span-2">
              <h1 className="text-5xl font-extrabold">{leader.name}</h1>
              <p className="text-2xl font-semibold text-primary flex items-center gap-2"><UserCheck className="w-6 h-6"/>{leader.position}</p>
              {leader.state && <p className="text-lg text-gray-600 flex items-center gap-2"><MapPin className="w-5 h-5 text-primary/70"/>{leader.state}</p>}
              <div className="mt-6 prose prose-lg max-w-none text-gray-700">
                {leader.bio.split("\n").map((p, idx) => <p key={idx}>{p}</p>)}
              </div>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
}