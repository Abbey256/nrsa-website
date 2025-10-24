import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminPlayers() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Players Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered athletes</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-player">
              <Plus className="w-4 h-4 mr-2" />
              Add Player
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Player</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Full Name *</Label>
                <Input placeholder="Player name" data-testid="input-name" />
              </div>
              <div>
                <Label>Photo URL</Label>
                <Input placeholder="https://example.com/photo.jpg" data-testid="input-photo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Club *</Label>
                  <Input placeholder="Club name" data-testid="input-club" />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input placeholder="Lagos State" data-testid="input-state" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category *</Label>
                  <Input placeholder="Senior Male" data-testid="input-category" />
                </div>
                <div>
                  <Label>Total Points</Label>
                  <Input type="number" placeholder="0" defaultValue="0" data-testid="input-points" />
                </div>
              </div>
              <div>
                <Label>Achievements</Label>
                <Textarea placeholder="List of achievements..." className="min-h-[100px]" data-testid="input-achievements" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-player">
                Save Player
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No players registered yet. Click "Add Player" to register one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
