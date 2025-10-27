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

interface Leader {
  id?: number;
  name: string;
  position: string;
  photoUrl?: string;
  bio?: string;
  order: number;
}

export default function AdminLeaders() {
  const [leaders, setLeaders] = useState<Leader[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingLeader, setEditingLeader] = useState<Leader | null>(null);
  const [form, setForm] = useState<Leader>({
    name: "",
    position: "",
    photoUrl: "",
    bio: "",
    order: 0,
  });

  const [open, setOpen] = useState(false);

  const API_URL = "/api/leaders";

  useEffect(() => {
    fetchLeaders();
  }, []);

  const fetchLeaders = async () => {
    setLoading(true);
    try {
      const res = await apiRequest("GET", API_URL);
      const data = await res.json();
      setLeaders(data);
    } catch (err) {
      console.error("Error fetching leaders:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    const method = editingLeader ? "PATCH" : "POST";
    const url = editingLeader ? `${API_URL}/${editingLeader.id}` : API_URL;

    try {
      await apiRequest(method, url, form);
      await fetchLeaders();
      setForm({
        name: "",
        position: "",
        photoUrl: "",
        bio: "",
        order: 0,
      });
      setEditingLeader(null);
      setOpen(false);
    } catch (err) {
      console.error("Error saving leader:", err);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this leader?")) return;
    try {
      await apiRequest("DELETE", `${API_URL}/${id}`);
      setLeaders(leaders.filter((l) => l.id !== id));
    } catch (err) {
      console.error("Error deleting leader:", err);
    }
  };

  const handleEdit = (leader: Leader) => {
    setEditingLeader(leader);
    setForm(leader);
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

      {loading ? (
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
