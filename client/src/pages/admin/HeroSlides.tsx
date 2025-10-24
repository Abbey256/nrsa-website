import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Edit, Trash, MoveUp, MoveDown } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminHeroSlides() {
  const [slides] = useState([]);

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Hero Slides</h1>
          <p className="text-muted-foreground mt-2">Manage homepage hero carousel slides</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-slide">
              <Plus className="w-4 h-4 mr-2" />
              Add Slide
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Hero Slide</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Image URL *</Label>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-image-url" />
              </div>
              <div>
                <Label>Headline *</Label>
                <Input placeholder="Main headline text" data-testid="input-headline" />
              </div>
              <div>
                <Label>Subheadline</Label>
                <Input placeholder="Supporting text (optional)" data-testid="input-subheadline" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>CTA Button Text</Label>
                  <Input placeholder="Learn More" data-testid="input-cta-text" />
                </div>
                <div>
                  <Label>CTA Link</Label>
                  <Input placeholder="/about" data-testid="input-cta-link" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch data-testid="switch-active" />
                <Label>Active</Label>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-slide">
                Save Slide
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {slides.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No hero slides created yet. Click "Add Slide" to create one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Slides will be listed here */}
        </div>
      )}
    </div>
  );
}
