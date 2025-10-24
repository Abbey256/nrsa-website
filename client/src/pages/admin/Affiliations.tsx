import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export default function AdminAffiliations() {
  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Affiliations Management</h1>
          <p className="text-muted-foreground mt-2">Manage international affiliations</p>
        </div>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90" data-testid="button-add-affiliation">
              <Plus className="w-4 h-4 mr-2" />
              Add Affiliation
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Affiliation</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label>Organization Name *</Label>
                <Input placeholder="IJRU, IRSO, etc." data-testid="input-name" />
              </div>
              <div>
                <Label>Logo URL *</Label>
                <Input placeholder="https://example.com/logo.jpg" data-testid="input-logo" />
              </div>
              <div>
                <Label>Website</Label>
                <Input placeholder="https://ijru.sport" data-testid="input-website" />
              </div>
              <div>
                <Label>Description</Label>
                <Textarea placeholder="Brief description..." className="min-h-[100px]" data-testid="input-description" />
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" placeholder="0" defaultValue="0" data-testid="input-order" />
              </div>
              <Button className="w-full bg-primary hover:bg-primary/90" data-testid="button-save-affiliation">
                Save Affiliation
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="py-12 text-center">
          <p className="text-muted-foreground">No affiliations yet. Click "Add Affiliation" to create one.</p>
        </CardContent>
      </Card>
    </div>
  );
}
