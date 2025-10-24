import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminEvents() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-2">Manage upcoming events and competitions</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-event">
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Add Event</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Event Title *</Label>
                <Input placeholder="Event name" data-testid="input-title" />
              </div>
              <div>
                <Label>Description *</Label>
                <Textarea placeholder="Event details..." className="min-h-[120px]" data-testid="input-description" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Venue *</Label>
                  <Input placeholder="Stadium name" data-testid="input-venue" />
                </div>
                <div>
                  <Label>City *</Label>
                  <Input placeholder="Lagos" data-testid="input-city" />
                </div>
              </div>
              <div>
                <Label>State *</Label>
                <Input placeholder="Lagos State" data-testid="input-state" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Date *</Label>
                  <Input type="datetime-local" data-testid="input-event-date" />
                </div>
                <div>
                  <Label>Registration Deadline</Label>
                  <Input type="datetime-local" data-testid="input-deadline" />
                </div>
              </div>
              <div>
                <Label>Image URL</Label>
                <Input placeholder="https://example.com/image.jpg" data-testid="input-image" />
              </div>
              <div className="flex items-center gap-2">
                <Switch data-testid="switch-featured" />
                <Label>Featured Event</Label>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-event">
                Save Event
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No events yet. Click "Add Event" to create one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
