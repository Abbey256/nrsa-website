import { useEffect, useState } from "react";
import { useRoute, useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface Leader {
  id: number;
  name: string;
  position: string;
  bio?: string;
  photoUrl?: string;
  order: number;
  state?: string;
}

export default function LeaderDetail() {
  const [match, params] = useRoute("/leaders/:id");
  const id = params?.id;

  const [, navigate] = useLocation();
  const [leader, setLeader] = useState<Leader | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchLeader = async () => {
      try {
        const res = await fetch(`/api/leaders/${id}`);
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const data: Leader = await res.json();
        setLeader(data);
        setError(null);
      } catch (e) {
        console.error(e);
        setError("Could not load leader details. Please check the API connection.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLeader();
  }, [id]);

  if (!id) return <div className="p-12 text-center text-red-700">Invalid leader ID</div>;
  if (isLoading) return <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>;
  if (error) return <div className="p-12 text-center text-red-700">{error}</div>;
  if (!leader) return <div className="p-12 text-center text-yellow-700">Leader not found</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <button className="mb-6 text-primary underline" onClick={() => navigate("/leaders")}>
        &larr; Back to Leaders
      </button>

      <Card>
        <CardContent className="text-center">
          <img
            src={leader.photoUrl || "https://placehold.co/400x400/009739/ffffff?text=NRSA"}
            alt={leader.name}
            className="w-full max-w-xs mx-auto h-64 object-cover rounded-md mb-4"
          />
          <h2 className="text-2xl font-bold">{leader.name}</h2>
          <p className="text-primary font-semibold">{leader.position}</p>
          {leader.state && <p className="text-muted-foreground">{leader.state}</p>}
          {leader.bio && <p className="mt-4 text-foreground">{leader.bio}</p>}
        </CardContent>
      </Card>
    </div>
  );
}