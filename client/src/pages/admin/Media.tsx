import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminMedia() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Media Management</h1>
          <p className="text-muted-foreground mt-2">Manage gallery images</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-media">
              <Plus className="w-4 h-4 mr-2" />
              Add Media
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Media</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Title *</Label>
                <Input placeholder="Image title" data-testid="input-title" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Image description..." className="min-h-[80px]" data-testid="input-description" />
              </div>
              <div>
                <Label>Image URL *</Label>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-image" />
              </div>
              <div>
                <Label>Category *</Label>
                <Input placeholder="Competitions, Training, Events, Awards" data-testid="input-category" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-media">
                Save Media
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No media items yet. Click "Add Media" to upload one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
