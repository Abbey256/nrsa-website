import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";

export default function AdminClubs() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clubs Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered clubs</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-club">
              <Plus className="w-4 h-4 mr-2" />
              Add Club
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Club</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Club Name *</Label>
                <Input placeholder="Club name" data-testid="input-name" />
              </div>
              <div>
                <Label>Logo URL</Label>
                <Input placeholder="https://example.com/logo.jpg" data-testid="input-logo" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input placeholder="Lagos" data-testid="input-city" />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input placeholder="Lagos State" data-testid="input-state" />
                </div>
              </div>
              <div>
                <Label>Manager Name *</Label>
                <Input placeholder="Manager full name" data-testid="input-manager" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input type="email" placeholder="club@email.com" data-testid="input-email" />
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input placeholder="+234 xxx xxx xxxx" data-testid="input-phone" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Switch defaultChecked data-testid="switch-registered" />
                <Label>Registered</Label>
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-club">
                Save Club
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No clubs registered yet. Click "Add Club" to register one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
