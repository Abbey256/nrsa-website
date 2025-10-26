import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2, Edit2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";

/**
 * Player Interface - Updated with new fields
 * - awardsWon: Number of awards/titles won
 * - gamesPlayed: Total games played  
 * - biography: Player biography and background
 */
interface Player {
  id?: number;
  name: string;
  photoUrl?: string;
  club: string;
  state: string;
  category: string;
  totalPoints: number;
  achievements?: string;
  awardsWon?: number;
  gamesPlayed?: number;
  biography?: string;
}

export default function AdminPlayers() {
  const [players, setPlayers] = useState<Player[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [form, setForm] = useState<Player>({
    name: "",
    photoUrl: "",
    club: "",
    state: "",
    category: "",
    totalPoints: 0,
    achievements: "",
    awardsWon: 0,
    gamesPlayed: 0,
    biography: "",
  });

  const [open, setOpen] = useState(false);

  const API_URL = "/api/players";

  // Fetch players
  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", API_URL);
      const data = await res.json();
      setPlayers(data);
    } catch (err) {
      console.error("Error fetching players:", err);
    } finally {
      setLoading(false);
    }
  };

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add or Edit Player
  const handleSave = async () => {
    const method = editingPlayer ? "PATCH" : "POST";
    const url = editingPlayer ? `${API_URL}/${editingPlayer.id}` : API_URL;

    try {
      await apiRequest(method, url, form);
      await fetchPlayers();
      setForm({
        name: "",
        photoUrl: "",
        club: "",
        state: "",
        category: "",
        totalPoints: 0,
        achievements: "",
        awardsWon: 0,
        gamesPlayed: 0,
        biography: "",
      });
      setEditingPlayer(null);
      setOpen(false);
    } catch (err) {
      console.error("Error saving player:", err);
    }
  };

  // Delete player
  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this player?")) return;
    try {
      await apiRequest("DELETE", `${API_URL}/${id}`);
      setPlayers(players.filter((p) => p.id !== id));
    } catch (err) {
      console.error("Error deleting player:", err);
    }
  };

  // Open Edit Dialog
  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setForm(player);
    setOpen(true);
  };

  return (
    <div>
      {/* Header Section */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Players Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage registered athletes — Add, Edit, or Delete players
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditingPlayer(null);
                setForm({
                  name: "",
                  photoUrl: "",
                  club: "",
                  state: "",
                  category: "",
                  totalPoints: 0,
                  achievements: "",
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingPlayer ? "Edit Player" : "Add Player"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  name="name"
                  placeholder="Player name"
                  value={form.name}
                  onChange={handleChange}
                />
              </div>
              <ImageUpload
                label="Player Photo"
                value={form.photoUrl || ""}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
              />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Club *</Label>
                  <Input
                    name="club"
                    placeholder="Club name"
                    value={form.club}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input
                    name="state"
                    placeholder="Lagos State"
                    value={form.state}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Input
                    name="category"
                    placeholder="Senior Male"
                    value={form.category}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Total Points</Label>
                  <Input
                    type="number"
                    name="totalPoints"
                    value={form.totalPoints}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div>
                <Label>Achievements</Label>
                <Textarea
                  name="achievements"
                  placeholder="List of achievements..."
                  value={form.achievements}
                  onChange={handleChange}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Awards Won</Label>
                  <Input
                    type="number"
                    name="awardsWon"
                    value={form.awardsWon || 0}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label>Games Played</Label>
                  <Input
                    type="number"
                    name="gamesPlayed"
                    value={form.gamesPlayed || 0}
                    onChange={handleChange}
                    placeholder="0"
                  />
                </div>
              </div>
              <div>
                <Label>Biography</Label>
                <Textarea
                  name="biography"
                  placeholder="Player biography and background..."
                  value={form.biography || ""}
                  onChange={handleChange}
                  className="min-h-[100px]"
                />
              </div>
              <Button
                onClick={handleSave}
                className="w-full bg-primary hover:bg-primary/90"
              >
                {editingPlayer ? "Update Player" : "Save Player"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Players List */}
      {loading ? (
        <p className="text-center text-muted-foreground py-12">Loading players...</p>
      ) : players.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No players registered yet. Click "Add Player" to register one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {players.map((player) => (
            <Card key={player.id} className="hover:shadow-md transition-all">
              <CardContent className="p-6 space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="font-bold text-lg">{player.name}</h3>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(player)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(player.id!)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">
                  {player.club} — {player.state}
                </p>
                <p className="text-sm font-semibold text-primary">
                  {player.category}
                </p>
                <p className="text-xs text-muted-foreground">
                  Points: {player.totalPoints}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
