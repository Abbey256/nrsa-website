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
import type { Leader } from "@shared/schema";

export default function AdminLeaders() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    photoUrl: "",
    bio: "",
    order: 0,
  });

  const { data: leaders = [], isLoading } = useQuery<Leader[]>({
    queryKey: ["/api/leaders"],
  });

  const saveLeader = useMutation({
    mutationFn: async () => {
      const method = editingLeader ? "PATCH" : "POST";
      const url = editingLeader ? `/api/leaders/${editingLeader.id}` : "/api/leaders";
      await apiRequest(method, url, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
      toast({
        title: editingLeader ? "Leader Updated" : "Leader Added",
        description: "Leader profile saved successfully!",
      });
      setOpen(false);
      setEditingLeader(null);
      setForm({
        name: "",
        position: "",
        photoUrl: "",
        bio: "",
        order: 0,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save leader.",
        variant: "destructive",
      });
    },
  });

  const deleteLeader = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/leaders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
      toast({
        title: "Leader Deleted",
        description: "The leader profile has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete leader.",
        variant: "destructive",
      });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    if (!form.name || !form.position) {
      toast({
        title: "Validation Error",
        description: "Name and position are required fields.",
        variant: "destructive",
      });
      return;
    }
    saveLeader.mutate();
  };

  const handleDelete = (id: number) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    deleteLeader.mutate(id);
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setForm({
      name: leader.name,
      position: leader.position,
      photoUrl: leader.photoUrl || "",
      bio: leader.bio || "",
      order: leader.order,
    });
    setOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Leaders Management
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage federation leaders — Add, Edit, or Delete leadership profiles
          </p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              data-testid="button-add-leader"
              onClick={() => {
                setEditingLeader(null);
                setForm({
                  name: "",
                  position: "",
                  photoUrl: "",
                  bio: "",
                  order: 0,
                });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Leader
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editingLeader ? "Edit Leader" : "Add Leader"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input
                  name="name"
                  placeholder="Leader name"
                  value={form.name}
                  onChange={handleChange}
                  data-testid="input-leader-name"
                />
              </div>
              <div>
                <Label>Position *</Label>
                <Input
                  name="position"
                  placeholder="e.g., President, Vice President"
                  value={form.position}
                  onChange={handleChange}
                  data-testid="input-leader-position"
                />
              </div>
              <ImageUpload
                label="Leader Photo"
                value={form.photoUrl || ""}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
              />
              <div>
                <Label>Biography</Label>
                <Textarea
                  name="bio"
                  placeholder="Leader's biography and background..."
                  value={form.bio}
                  onChange={handleChange}
                  rows={5}
                  data-testid="input-leader-bio"
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  name="order"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                  data-testid="input-leader-order"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Lower numbers appear first (e.g., President = 0, VP = 1)
                </p>
              </div>
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleSave}
                  className="bg-primary hover:bg-primary/90 flex-1"
                  data-testid="button-save-leader"
                >
                  {editingLeader ? "Update Leader" : "Add Leader"}
                </Button>
                <Button
                  onClick={() => setOpen(false)}
                  variant="outline"
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <p className="text-center text-muted-foreground py-12">Loading leaders...</p>
      ) : leaders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No leaders added yet. Click "Add Leader" to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {leaders.map((leader) => (
            <Card
              key={leader.id}
              className="hover:shadow-md transition-all"
              data-testid={`card-leader-${leader.id}`}
            >
              <CardContent className="p-6 space-y-4">
                {leader.photoUrl && (
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    className="w-full h-48 object-cover rounded-md"
                  />
                )}
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg" data-testid={`text-leader-name-${leader.id}`}>
                      {leader.name}
                    </h3>
                    <p className="text-sm text-primary font-semibold" data-testid={`text-leader-position-${leader.id}`}>
                      {leader.position}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Order: {leader.order}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEdit(leader)}
                      data-testid={`button-edit-${leader.id}`}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(leader.id!)}
                      data-testid={`button-delete-${leader.id}`}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                {leader.bio && (
                  <p className="text-sm text-muted-foreground line-clamp-3">
                    {leader.bio}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
