import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

type News = {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  imageUrl?: string;
  isFeatured?: boolean;
  publishedAt: string;
};

export default function AdminNews() {
  const queryClient = useQueryClient();
  const { data: newsItems = [] } = useQuery<News[]>({
    queryKey: ["/api/news"],
  });

  const [dialogOpen, setDialogOpen] = useState(false);
  const [editItem, setEditItem] = useState<News | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    excerpt: "",
    content: "",
    imageUrl: "",
    isFeatured: false,
  });

  // 🔹 Create or Update
  const saveMutation = useMutation({
    mutationFn: async () => {
      const method = editItem ? "PATCH" : "POST";
      const url = editItem ? `/api/news/${editItem.id}` : "/api/news";

      const res = await apiRequest(method, url, formData);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/news"] });
      setDialogOpen(false);
      setEditItem(null);
      resetForm();
    },
  });

  // 🔹 Delete
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/news/${id}`);
      return res.status === 204 ? null : res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/news"] }),
  });

  const handleSave = () => {
    if (!formData.title || !formData.excerpt || !formData.content) {
      alert("Please fill in all required fields");
      return;
    }
    saveMutation.mutate();
  };

  const handleEdit = (item: News) => {
    setEditItem(item);
    setFormData({
      title: item.title,
      excerpt: item.excerpt,
      content: item.content,
      imageUrl: item.imageUrl || "",
      isFeatured: item.isFeatured || false,
    });
    setDialogOpen(true);
  };

  const handleDelete = (id: number) => {
    if (confirm("Are you sure you want to delete this article?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () =>
    setFormData({
      title: "",
      excerpt: "",
      content: "",
      imageUrl: "",
      isFeatured: false,
    });

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage news articles</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => {
                setEditItem(null);
                resetForm();
              }}
            >
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editItem ? "Edit News Article" : "Add News Article"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Article title"
                />
              </div>
              <div>
                <Label>Excerpt *</Label>
                <Textarea
                  value={formData.excerpt}
                  onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                  placeholder="Brief summary..."
                  className="min-h-[80px]"
                />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article content..."
                  className="min-h-[200px]"
                />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: checked })}
                />
                <Label>Featured Article</Label>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" onClick={handleSave}>
                {editItem ? "Update Article" : "Save Article"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* News Table */}
      {newsItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No news articles yet. Click "Add News" to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader className="bg-primary/10">
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Published</TableHead>
                <TableHead>Featured</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {newsItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.title}</TableCell>
                  <TableCell>{new Date(item.publishedAt).toLocaleDateString()}</TableCell>
                  <TableCell>{item.isFeatured ? "Yes" : "No"}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleEdit(item)}
                      className="hover:bg-primary/10"
                    >
                      <Edit className="w-4 h-4 mr-1" /> Edit
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                    >
                      <Trash className="w-4 h-4 mr-1" /> Delete
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
