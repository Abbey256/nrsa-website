import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";
import type { Leader } from "@shared/schema";

/**
 * Leaders Admin Page
 * 
 * CRITICAL FIX: Connected to actual API endpoints instead of local state
 * Leaders are now saved to the database and appear on the live site
 * 
 * Features:
 * - Image upload with drag-and-drop
 * - Full CRUD operations connected to /api/leaders
 * - Automatic refresh of live site when changes are made
 */
export default function AdminLeaders() {
  const queryClient = useQueryClient();
  
  // Fetch leaders from API
  const { data: leaders = [] } = useQuery<Leader[]>({
    queryKey: ["/api/leaders"],
  });

  const [open, setOpen] = useState(false);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState({
    name: "",
    position: "",
    photoUrl: "",
    bio: "",
    order: 0,
  });

  // Create or Update Leader
  const saveLeader = useMutation({
    mutationFn: async () => {
      const method = editingLeader ? "PATCH" : "POST";
      const url = editingLeader ? `/api/leaders/${editingLeader.id}` : "/api/leaders";
      await apiRequest(method, url, form);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
      setOpen(false);
      setEditingLeader(null);
      setForm({ name: "", position: "", photoUrl: "", bio: "", order: 0 });
    },
  });

  // Delete Leader
  const deleteLeader = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest("DELETE", `/api/leaders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/leaders"] });
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: name === "order" ? Number(value) : value }));
  };

  const handleSave = () => {
    if (!form.name || !form.position) {
      alert("Name and position are required!");
      return;
    }
    saveLeader.mutate();
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

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this leader?")) {
      deleteLeader.mutate(id);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaders Management</h1>
          <p className="text-muted-foreground mt-2">Manage federation leadership</p>
        </div>

        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              data-testid="button-add-leader"
              onClick={() => {
                setEditingLeader(null);
                setForm({ name: "", position: "", photoUrl: "", bio: "", order: 0 });
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
                />
              </div>
              <div>
                <Label>Position *</Label>
                <Input
                  name="position"
                  placeholder="President, Vice President, etc."
                  value={form.position}
                  onChange={handleChange}
                />
              </div>
              <ImageUpload
                label="Leader Photo"
                value={form.photoUrl}
                onChange={(url) => setForm({ ...form, photoUrl: url })}
              />
              <div>
                <Label>Bio</Label>
                <Textarea
                  name="bio"
                  placeholder="Brief biography..."
                  className="min-h-[120px]"
                  value={form.bio}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input
                  name="order"
                  type="number"
                  placeholder="0"
                  value={form.order}
                  onChange={handleChange}
                />
              </div>
              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSave}
                disabled={saveLeader.isPending}
              >
                {saveLeader.isPending
                  ? "Saving..."
                  : editingLeader
                  ? "Update Leader"
                  : "Save Leader"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {leaders.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No leaders added yet. Click "Add Leader" to add one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {leaders
            .sort((a, b) => a.order - b.order)
            .map((leader) => (
              <Card key={leader.id} className="relative p-4">
                {leader.photoUrl && (
                  <img
                    src={leader.photoUrl}
                    alt={leader.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-bold">{leader.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">{leader.position}</p>
                {leader.bio && <p className="text-sm mb-4">{leader.bio}</p>}
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(leader)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleDelete(leader.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </Card>
            ))}
        </div>
      )}
    </div>
  );
}
