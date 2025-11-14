import React from "react";
// src/pages/admin/AdminClubs.tsx
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Edit3 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import type { Club, InsertClub } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";

/**
 * AdminClubs — Admin UI for Clubs with Add / Edit / Delete
 *
 * Notes:
 * - Uses /api/clubs (GET, POST, PUT, DELETE)
 * - Non-destructive: keeps existing structure/styling
 * - Uses React Query to invalidate and refresh the clubs list after changes
 */

export default function AdminClubs() {
  const queryClient = useQueryClient();

  // Fetch clubs
  const { data: clubs = [], isLoading } = useQuery<Club[]>({
    queryKey: ["/api/clubs"],
  });

  // --- Add Club mutation ---
  const addClub = useMutation({
    mutationFn: async (newClub: InsertClub) => {
      const res = await apiRequest("POST", "/api/clubs", newClub);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });

  // --- Update Club mutation (Edit) ---
  const updateClub = useMutation({
    mutationFn: async (payload: { id: string; data: Partial<Club> }) => {
      const res = await apiRequest("PATCH", `/api/clubs/${payload.id}`, payload.data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });

  // --- Delete Club mutation ---
  const deleteClub = useMutation({
    mutationFn: async (id: string | number) => {
      await apiRequest("DELETE", `/api/clubs/${id}`);
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/clubs"] });
      const previousClubs = queryClient.getQueryData(["/api/clubs"]);
      queryClient.setQueryData(["/api/clubs"], (old: Club[] = []) => 
        old.filter(item => (item as any).id !== deletedId)
      );
      return { previousClubs };
    },
    onError: (error, deletedId, context) => {
      queryClient.setQueryData(["/api/clubs"], context?.previousClubs);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/clubs"] });
    },
  });

  // Form state for Add
  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    city: "",
    state: "",
    managerName: "",
    contactEmail: "",
    contactPhone: "",
    isRegistered: true,
  });

  // Edit state: which club is being edited and its form
  const [editingClubId, setEditingClubId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmitAdd = () => {
    if (!form.name || !form.city || !form.state || !form.managerName || !form.contactEmail || !form.contactPhone) {
      alert("Please fill all required fields.");
      return;
    }
    addClub.mutate(form);
    // clear form on success (best-effort)
    setForm({
      name: "",
      logoUrl: "",
      city: "",
      state: "",
      managerName: "",
      contactEmail: "",
      contactPhone: "",
      isRegistered: true,
    });
  };

  // Begin Edit for a club
  const startEdit = (club: Club) => {
    setEditingClubId(String((club as any).id));
    setEditForm({
      name: club.name ?? "",
      logoUrl: (club as any).logoUrl ?? (club as any).logo ?? "",
      city: club.city ?? "",
      state: club.state ?? "",
      managerName: club.managerName ?? "",
      contactEmail: club.contactEmail ?? "",
      contactPhone: club.contactPhone ?? "",
      isRegistered: Boolean((club as any).isRegistered),
    });
    setEditOpen(true);
  };

  const handleEditChange = (key: keyof typeof form, value: string | boolean) => {
    if (!editForm) return;
    setEditForm({ ...editForm, [key]: value });
  };

  const handleSubmitEdit = () => {
    if (!editingClubId || !editForm) return;
    // Basic validation
    if (!editForm.name || !editForm.city || !editForm.state || !editForm.managerName || !editForm.contactEmail || !editForm.contactPhone) {
      alert("Please fill all required fields.");
      return;
    }
    updateClub.mutate({ id: editingClubId, data: editForm });
    setEditOpen(false);
    setEditingClubId(null);
    setEditForm(null);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Clubs Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered clubs</p>
        </div>

        {/* Add Club Dialog */}
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
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <ImageUpload
                label="Club Logo"
                value={form.logoUrl}
                onChange={(url) => handleChange("logoUrl", url)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input value={form.city} onChange={(e) => handleChange("city", e.target.value)} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input value={form.state} onChange={(e) => handleChange("state", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Manager Name *</Label>
                <Input value={form.managerName} onChange={(e) => handleChange("managerName", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input value={form.contactEmail} onChange={(e) => handleChange("contactEmail", e.target.value)} />
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input value={form.contactPhone} onChange={(e) => handleChange("contactPhone", e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={form.isRegistered} onCheckedChange={(v) => handleChange("isRegistered", v)} />
                <Label>Registered</Label>
              </div>

              <Button onClick={handleSubmitAdd} className="w-full bg-primary hover:bg-primary/90" disabled={addClub.isPending}>
                {addClub.isPending ? "Saving..." : "Save Club"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Clubs List */}
      {isLoading ? (
        <div className="text-center py-20">Loading clubs...</div>
      ) : clubs.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No clubs registered yet. Click "Add Club" to register one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {clubs.map((club) => (
            <Card key={(club as any).id} className="p-6 relative">
              {/* Edit & Delete buttons */}
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(club)}
                  disabled={updateClub.isPending}
                  aria-label={`Edit ${club.name}`}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>

                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    // confirm before deleting
                    if (confirm(`Delete club "${club.name}"? This cannot be undone.`)) {
                      deleteClub.mutate((club as any).id);
                    }
                  }}
                  disabled={deleteClub.isPending}
                  aria-label={`Delete ${club.name}`}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>

              <CardContent>
                <h3 className="font-bold text-xl mb-2">{club.name}</h3>
                <p className="text-sm text-muted-foreground mb-1">{club.city}, {club.state}</p>
                <p className="text-sm mb-2">{club.managerName}</p>
                <p className="text-sm text-muted-foreground mb-1">{club.contactEmail}</p>
                <p className="text-sm text-muted-foreground">{club.contactPhone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Modal (controlled) */}
      <Dialog open={editOpen} onOpenChange={(v) => setEditOpen(v)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Club</DialogTitle>
          </DialogHeader>

          {editForm ? (
            <div className="space-y-4 mt-4">
              <div>
                <Label>Club Name *</Label>
                <Input value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} />
              </div>

              <ImageUpload
                label="Club Logo"
                value={editForm.logoUrl}
                onChange={(url) => handleEditChange("logoUrl", url)}
              />

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>City *</Label>
                  <Input value={editForm.city} onChange={(e) => handleEditChange("city", e.target.value)} />
                </div>
                <div>
                  <Label>State *</Label>
                  <Input value={editForm.state} onChange={(e) => handleEditChange("state", e.target.value)} />
                </div>
              </div>

              <div>
                <Label>Manager Name *</Label>
                <Input value={editForm.managerName} onChange={(e) => handleEditChange("managerName", e.target.value)} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Contact Email *</Label>
                  <Input value={editForm.contactEmail} onChange={(e) => handleEditChange("contactEmail", e.target.value)} />
                </div>
                <div>
                  <Label>Contact Phone *</Label>
                  <Input value={editForm.contactPhone} onChange={(e) => handleEditChange("contactPhone", e.target.value)} />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Switch checked={editForm.isRegistered} onCheckedChange={(v) => handleEditChange("isRegistered", v)} />
                <Label>Registered</Label>
              </div>

              <div className="flex gap-2">
                <Button onClick={() => { setEditOpen(false); setEditingClubId(null); setEditForm(null); }} variant="ghost">Cancel</Button>
                <Button onClick={handleSubmitEdit} disabled={updateClub.isPending} className="bg-primary hover:bg-primary/90">
                  {updateClub.isPending ? "Saving..." : "Save Changes"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="py-10 text-center">Loading...</div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}