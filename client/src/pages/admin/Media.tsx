import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Plus, Trash, Edit2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Media } from "@shared/schema";
import axios from "axios";

export default function AdminMedia() {
  const queryClient = useQueryClient();

  // For dialog open/close control
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  // Fetch all media
  const { data: mediaItems = [] } = useQuery<Media[]>({
    queryKey: ["/api/media"],
    queryFn: async () => {
      const res = await axios.get("/api/media");
      return res.data;
    },
  });

  const [editingMedia, setEditingMedia] = useState<Media | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    imageUrl: "",
    category: "",
  });

  // Save (add/edit)
  const saveMedia = useMutation({
    mutationFn: async (media: Media) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized - No token found");

      const config = {
        headers: { Authorization: `Bearer ${token}` },
      };

      if (editingMedia) {
        await axios.put(`/api/media/${editingMedia.id}`, media, config);
      } else {
        await axios.post("/api/media", media, config);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/media"] });
      setEditingMedia(null);
      setForm({ title: "", description: "", imageUrl: "", category: "" });
      setIsDialogOpen(false);
    },
  });

  // Delete
  const deleteMedia = useMutation({
    mutationFn: async (id: number) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized - No token found");

      await axios.delete(`/api/media/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/media"] }),
  });

  // Submit handler
  const handleSubmit = () => {
    if (!form.title || !form.imageUrl || !form.category) {
      alert("Please fill all required fields.");
      return;
    }
    saveMedia.mutate(form as Media);
  };

  // Edit handler
  const handleEdit = (item: Media) => {
    setEditingMedia(item);
    setForm({
      title: item.title,
      description: item.description || "",
      imageUrl: item.imageUrl,
      category: item.category || "",
    });
    setIsDialogOpen(true); // 💡 Open dialog when edit clicked
  };

  // Reset form when opening for new add
  const handleAddNew = () => {
    setEditingMedia(null);
    setForm({ title: "", description: "", imageUrl: "", category: "" });
    setIsDialogOpen(true);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Management</h1>
          <p className="text-muted-foreground mt-2">
            Add, edit, or delete gallery images
          </p>
        </div>

        <Button className="bg-primary hover:bg-primary/90" onClick={handleAddNew}>
          <Plus className="w-4 h-4 mr-2" />
          Add Media
        </Button>
      </div>

      {/* 💡 Modal Dialog (now controlled) */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingMedia ? "Edit Media" : "Add Media"}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div>
              <Label>Title *</Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <ImageUpload
              label="Media Image *"
              value={form.imageUrl}
              onChange={(url) => setForm({ ...form, imageUrl: url })}
            />

            <div>
              <Label>Category *</Label>
              <Select
                value={form.category}
                onValueChange={(value) => setForm({ ...form, category: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Training">Training</SelectItem>
                  <SelectItem value="Achievement">Achievement</SelectItem>
                  <SelectItem value="Event">Event</SelectItem>
                  <SelectItem value="Announcement">Announcement</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <Button
              className="w-full bg-primary hover:bg-primary/90"
              onClick={handleSubmit}
              disabled={saveMedia.isPending}
            >
              {saveMedia.isPending
                ? "Saving..."
                : editingMedia
                ? "Update Media"
                : "Save Media"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* MEDIA LIST */}
      {mediaItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No media items yet. Click "Add Media" to upload one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {mediaItems.map((item) => (
            <Card key={item.id} className="overflow-hidden p-4">
              <img
                src={item.imageUrl}
                alt={item.title}
                className="w-full h-48 object-cover rounded-md"
              />
              <h3 className="font-semibold mt-3">{item.title}</h3>
              <p className="text-sm text-muted-foreground mb-2">
                {item.category}
              </p>
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleEdit(item)}
                >
                  <Edit2 className="w-4 h-4 mr-1" /> Edit
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => deleteMedia.mutate(item.id)}
                >
                  <Trash className="w-4 h-4 mr-1" /> Delete
                </Button>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}