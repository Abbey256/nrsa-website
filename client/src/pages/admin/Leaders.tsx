import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminLeaders() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Leaders Management</h1>
          <p className="text-muted-foreground mt-2">Manage federation leadership</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-leader">
              <Plus className="w-4 h-4 mr-2" />
              Add Leader
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Leader</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="Leader name" data-testid="input-name" />
              </div>
              <div>
                <Label>Position *</Label>
                <Input placeholder="President, Vice President, etc." data-testid="input-position" />
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input placeholder="https://example.com/photo.jpg" data-testid="input-photo" />
              </div>
              <div>
                <Label>Bio</Label>
                <Textarea placeholder="Brief biography..." className="min-h-[120px]" data-testid="input-bio" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" placeholder="0" defaultValue="0" data-testid="input-order" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-leader">
                Save Leader
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No leaders added yet. Click "Add Leader" to add one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
