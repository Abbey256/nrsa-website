import React from "react";
import { useState } from "react";
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
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Player } from "@shared/schema";

export default function AdminPlayers() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingPlayer, setEditingPlayer] = useState<Player | null>(null);
  const [form, setForm] = useState({
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

  const { data: players = [], isLoading } = useQuery<Player[]>({
    queryKey: ["/api/players"],
  });

  const savePlayer = useMutation({
    mutationFn: async () => {
      const method = editingPlayer ? "PATCH" : "POST";
      const url = editingPlayer ? `/api/players/${editingPlayer.id}` : "/api/players";
      await apiRequest(method, url, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: editingPlayer ? "Player Updated" : "Player Added",
        description: "Player profile saved successfully!",
      });
      setOpen(false);
      setEditingPlayer(null);
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
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save player.",
        variant: "destructive",
      });
    },
  });

  const deletePlayer = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/players/${id}`);
      return id;
    },
    onSuccess: (deletedId) => {
      queryClient.setQueryData(["/api/players"], (old: Player[] = []) => 
        old.filter(item => item.id !== deletedId)
      );
      queryClient.invalidateQueries({ queryKey: ["/api/players"] });
      toast({
        title: "Player Deleted",
        description: "The player profile has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete player.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.club || !form.state || !form.category) {
      toast({
        title: "Validation Error",
        description: "Name, club, state, and category are required fields.",
        variant: "destructive",
      });
      return;
    }
    savePlayer.mutate();
  };

  const handleDelete = (id: number) => {
    if (!window.confirm("Are you sure you want to delete this player?")) return;
    deletePlayer.mutate(id);
  };

  const handleEdit = (player: Player) => {
    setEditingPlayer(player);
    setForm({
      name: player.name,
      photoUrl: player.photoUrl || "",
      club: player.club,
      state: player.state,
      category: player.category,
      totalPoints: player.totalPoints,
      achievements: player.achievements || "",
      awardsWon: player.awardsWon || 0,
      gamesPlayed: player.gamesPlayed || 0,
      biography: player.biography || "",
    });
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
                  awardsWon: 0,
                  gamesPlayed: 0,
                  biography: "",
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
                disabled={savePlayer.isPending}
              >
                {savePlayer.isPending ? "Saving..." : editingPlayer ? "Update Player" : "Save Player"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Players List */}
      {isLoading ? (
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
                      disabled={deletePlayer.isPending}
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
