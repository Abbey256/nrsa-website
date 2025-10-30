// src/pages/admin/AdminMemberStates.tsx
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
import type { MemberState, InsertMemberState } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { ImageUpload } from "@/components/admin/ImageUpload";

export default function AdminMemberStates() {
  const queryClient = useQueryClient();

  const { data: states = [], isLoading } = useQuery<MemberState[]>({
    queryKey: ["/api/member-states"],
  });

  // --- Mutations (No changes needed) ---
  const addState = useMutation({
    mutationFn: async (newState: InsertMemberState) => {
      const res = await apiRequest("POST", "/api/member-states", newState);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member-states"] });
    },
  });

  const updateState = useMutation({
    mutationFn: async (payload: { id: string; data: Partial<MemberState> }) => {
      const res = await apiRequest("PATCH", `/api/member-states/${payload.id}`, payload.data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/member-states"] });
    },
  });

  const deleteState = useMutation({
    mutationFn: async (id: string | number) => {
      const res = await apiRequest("DELETE", `/api/member-states/${id}`);
      return res.status === 204 ? null : res.json();
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["/api/member-states"] }),
  });
  // -------------------------------------

  const [form, setForm] = useState({
    name: "",
    logoUrl: "",
    representativeName: "",
    contactEmail: "",
    contactPhone: "",
    isRegistered: true,
    useUpload: true,
  });

  // State for editing modal
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<typeof form | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const handleChange = (key: keyof typeof form, value: string | boolean) => {
    setForm((p) => ({ ...p, [key]: value }));
  };

  const handleSubmitAdd = () => {
    // ... (Add form submission logic)
    if (!form.name || !form.representativeName || !form.contactEmail || !form.contactPhone) {
      alert("Please fill all required fields.");
      return;
    }
    addState.mutate({
      ...form,
      // Ensure only relevant fields are passed to InsertMemberState
      // The 'useUpload' field should be excluded before mutation.
      useUpload: undefined, 
    });
    setForm({
      name: "",
      logoUrl: "",
      representativeName: "",
      contactEmail: "",
      contactPhone: "",
      isRegistered: true,
      useUpload: true,
    });
  };

  const startEdit = (state: MemberState) => {
    setEditingId(String(state.id));
    setEditForm({
      name: state.name ?? "",
      logoUrl: state.logoUrl ?? "",
      representativeName: state.representativeName ?? "",
      contactEmail: state.contactEmail ?? "",
      contactPhone: state.contactPhone ?? "",
      isRegistered: Boolean(state.isRegistered),
      // The logoUrl determines if the image input or URL input should be shown in edit.
      useUpload: !state.logoUrl || state.logoUrl.startsWith("http") === false, 
    });
    setEditOpen(true);
  };

  const handleEditChange = (key: keyof typeof form, value: string | boolean) => {
    if (!editForm) return;
    setEditForm((p) => (p ? { ...p, [key]: value } : null)); // Use functional update
  };

  const handleSubmitEdit = () => {
    if (!editingId || !editForm) return;
    if (!editForm.name || !editForm.representativeName || !editForm.contactEmail || !editForm.contactPhone) {
      alert("Please fill all required fields.");
      return;
    }

    // Create payload, excluding the temporary 'useUpload' field
    const { useUpload, ...dataToSave } = editForm;

    updateState.mutate({ id: editingId, data: dataToSave });
    setEditOpen(false);
    setEditingId(null);
    setEditForm(null);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Member States Management</h1>
          <p className="text-muted-foreground mt-2">Manage registered member states</p>
        </div>

        {/* ADD Member State Dialog (OK) */}
        <Dialog>
          <DialogTrigger asChild>
            <Button className="bg-primary hover:bg-primary/90">
              <Plus className="w-4 h-4 mr-2" />
              Add Member State
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add Member State</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {/* ... (Add form fields - OK) ... */}
              <div>
                <Label>State Name *</Label>
                <Input value={form.name} onChange={(e) => handleChange("name", e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={form.useUpload}
                  onCheckedChange={(v) => handleChange("useUpload", v)}
                />
                <Label>{form.useUpload ? "Upload Logo" : "Use Logo URL"}</Label>
              </div>

              {form.useUpload ? (
                <ImageUpload
                  label="State Logo"
                  value={form.logoUrl}
                  onChange={(url) => handleChange("logoUrl", url)}
                />
              ) : (
                <div>
                  <Label>Logo URL</Label>
                  <Input value={form.logoUrl} onChange={(e) => handleChange("logoUrl", e.target.value)} />
                </div>
              )}

              <div>
                <Label>State Representative *</Label>
                <Input value={form.representativeName} onChange={(e) => handleChange("representativeName", e.target.value)} />
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

              <Button onClick={handleSubmitAdd} className="w-full bg-primary hover:bg-primary/90" disabled={addState.isPending}>
                {addState.isPending ? "Saving..." : "Save Member State"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Member States List */}
      {isLoading ? (
        <div className="text-center py-20">Loading member states...</div>
      ) : states.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">No member states registered yet. Click "Add Member State" to register one.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {states.map((state) => (
            <Card key={state.id} className="p-6 relative">
              <div className="absolute top-4 right-4 flex gap-2">
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => startEdit(state)}
                  disabled={updateState.isPending}
                >
                  <Edit3 className="w-4 h-4" />
                </Button>
                <Button
                  variant="destructive"
                  size="icon"
                  onClick={() => {
                    if (confirm(`Delete member state "${state.name}"? This cannot be undone.`)) {
                      deleteState.mutate(state.id);
                    }
                  }}
                  disabled={deleteState.isPending}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              <CardContent>
    <h3 className="font-bold text-xl mb-2">{state.name}</h3>
    <p className="text-sm text-muted-foreground mb-1">{state.representativeName}</p>
    <p className="text-sm text-muted-foreground mb-1">{state.contactEmail}</p>
    <p className="text-sm text-muted-foreground">{state.contactPhone}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* 🐛 FIX: Edit Dialog moved outside the map loop to be a single component */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Member State</DialogTitle>
          </DialogHeader>

          {editForm ? (
            <div className="space-y-4 mt-4">
              <div>
                <Label>State Name *</Label>
                <Input value={editForm.name} onChange={(e) => handleEditChange("name", e.target.value)} />
              </div>

              <div className="flex items-center gap-4">
                <Switch
                  checked={editForm.useUpload}
                  onCheckedChange={(v) => handleEditChange("useUpload", v)}
                />
                <Label>{editForm.useUpload ? "Upload Logo" : "Use Logo URL"}</Label>
              </div>

              {editForm.useUpload ? (
                <ImageUpload
                  label="State Logo"
                  value={editForm.logoUrl}
                  onChange={(url) => handleEditChange("logoUrl", url)}
                />
              ) : (
                <div>
                  <Label>Logo URL</Label>
                  <Input value={editForm.logoUrl} onChange={(e) => handleEditChange("logoUrl", e.target.value)} />
              </div>
              )}

              <div>
                <Label>State Representative *</Label>
                <Input value={editForm.representativeName} onChange={(e) => handleEditChange("representativeName", e.target.value)} />
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

              <div className="flex gap-2 justify-end">
                <Button onClick={() => { setEditOpen(false); setEditingId(null); setEditForm(null); }} variant="ghost">Cancel</Button>
                <Button onClick={handleSubmitEdit} disabled={updateState.isPending} className="bg-primary hover:bg-primary/90">
                  {updateState.isPending ? "Saving..." : "Save Changes"}
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