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

export default function AdminNews() {
  const [newsItems] = useState([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">News Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage news articles</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-news">
              <Plus className="w-4 h-4 mr-2" />
              Add News
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add News Article</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input placeholder="Article title" data-testid="input-title" />
              </div>
              <div>
                <Label>Excerpt *</Label>
                <Textarea placeholder="Brief summary..." className="min-h-[80px]" data-testid="input-excerpt" />
              </div>
              <div>
                <Label>Content *</Label>
                <Textarea placeholder="Full article content..." className="min-h-[200px]" data-testid="input-content" />
              </div>
              <div>
                <Label>Image URL</Label>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-image" />
              </div>
              <div className="flex items-center gap-2">
                <Switch data-testid="switch-featured" />
                <Label>Featured Article</Label>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-news">
                Save Article
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {newsItems.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No news articles yet. Click "Add News" to create one.</p>
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
              {/* News items will be listed here */}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
