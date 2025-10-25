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

interface LeaderForm {
  name: string;
  position: string;
  photo: string;
  bio: string;
  order: number;
}

export default function AdminLeaders() {
  const [leaders, setLeaders] = useState<LeaderForm[]>([]);
  const [open, setOpen] = useState(false);
  const [editIndex, setEditIndex] = useState<number | null>(null);
  const [form, setForm] = useState<LeaderForm>({
    name: "",
    position: "",
    photo: "",
    bio: "",
    order: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    if (!form.name || !form.position) return alert("Name and position are required!");
    let updated = [...leaders];
    if (editIndex !== null) {
      updated[editIndex] = form;
    } else {
      updated.push(form);
    }
    setLeaders(updated);
    setForm({ name: "", position: "", photo: "", bio: "", order: 0 });
    setEditIndex(null);
    setOpen(false);
  };

  const handleEdit = (index: number) => {
    setEditIndex(index);
    setForm(leaders[index]);
    setOpen(true);
  };

  const handleDelete = (index: number) => {
    if (window.confirm("Are you sure you want to delete this leader?")) {
      setLeaders(leaders.filter((_, i) => i !== index));
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
                setEditIndex(null);
                setForm({ name: "", position: "", photo: "", bio: "", order: 0 });
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Leader
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editIndex !== null ? "Edit Leader" : "Add Leader"}</DialogTitle>
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
              <div>
                <Label>Photo URL</Label>
                <Input
                  name="photo"
                  placeholder="https://example.com/photo.jpg"
                  value={form.photo}
                  onChange={handleChange}
                />
              </div>
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
              >
                {editIndex !== null ? "Update Leader" : "Save Leader"}
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
            .map((leader, index) => (
              <Card key={index} className="relative p-4">
                {leader.photo && (
                  <img
                    src={leader.photo}
                    alt={leader.name}
                    className="w-full h-48 object-cover rounded-lg mb-4"
                  />
                )}
                <h2 className="text-xl font-bold">{leader.name}</h2>
                <p className="text-sm text-muted-foreground mb-2">
                  {leader.position}
                </p>
                <p className="text-sm">{leader.bio}</p>

                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => handleEdit(index)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    className="w-full"
                    onClick={() => handleDelete(index)}
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
