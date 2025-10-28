import { useState, useMemo } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Image as ImageIcon, Edit } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import type { Media } from "@shared/schema";

export default function Media() {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [editingItem, setEditingItem] = useState<Media | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    imageUrl: "",
  });

  const queryClient = useQueryClient();

  const { data: mediaItems = [], isLoading } = useQuery<Media[]>({
    queryKey: ["/api/media"],
  });

  const updateMutation = useMutation({
    mutationFn: async (updatedItem: Media) => {
      const token = localStorage.getItem("adminToken");
      if (!token) throw new Error("Unauthorized — No token found");

      const res = await fetch(`/api/media/${updatedItem.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedItem),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({}));
        throw new Error(err.error || "Failed to update media");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["/api/media"]);
      setEditingItem(null);
      alert("✅ Media updated successfully!");
    },
    onError: (error: any) => {
      alert(`❌ ${error.message}`);
    },
  });

  const categories = useMemo(() => {
    const uniqueCategories = Array.from(new Set(mediaItems.map(item => item.category)));
    return ["All", ...uniqueCategories];
  }, [mediaItems]);

  const filteredMedia =
    selectedCategory === "All"
      ? mediaItems
      : mediaItems.filter((item) => item.category === selectedCategory);

  const handleEditClick = (item: Media) => {
    setEditingItem(item);
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      imageUrl: item.imageUrl,
    });
  };

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    updateMutation.mutate({ ...editingItem, ...formData });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">Media Gallery</h1>
          <p className="text-xl md:text-2xl opacity-90 max-w-3xl">
            Explore photos from training, achievements, events, and announcements.
          </p>
        </div>
      </section>

      {/* Category Filters */}
      <section className="py-8 bg-muted/30">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                onClick={() => setSelectedCategory(category)}
                className={selectedCategory === category ? "bg-primary hover:bg-primary/90" : ""}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Edit Form */}
      {editingItem && (
        <section className="py-8 bg-muted">
          <div className="max-w-xl mx-auto px-6">
            <h2 className="text-2xl font-bold mb-4">Edit Media</h2>
            <form onSubmit={handleUpdate} className="space-y-4">
              <input
                type="text"
                placeholder="Title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <textarea
                placeholder="Description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                placeholder="Image URL"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                className="w-full p-2 border rounded"
              />
              <div className="flex gap-3">
                <Button type="submit" disabled={updateMutation.isPending}>
                  {updateMutation.isPending ? "Updating..." : "Update"}
                </Button>
                <Button type="button" variant="outline" onClick={() => setEditingItem(null)}>
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </section>
      )}

      {/* Media Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {isLoading ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Loading media...</p>
            </div>
          ) : filteredMedia.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">
                No media items in this category.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredMedia.map((item) => (
                <Card
                  key={item.id}
                  className="overflow-hidden hover:elevate cursor-pointer transition-all relative"
                >
                  <div className="relative aspect-video bg-muted flex items-center justify-center">
                    {item.imageUrl ? (
                      <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <ImageIcon className="w-16 h-16 text-muted-foreground" />
                    )}
                    <div className="absolute top-3 right-3">
                      <Badge className="bg-primary text-primary-foreground">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                    <div className="mt-3 flex justify-end">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditClick(item)}
                      >
                        <Edit className="w-4 h-4 mr-1" /> Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}