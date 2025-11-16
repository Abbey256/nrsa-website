import React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { ImageUpload } from "@/components/admin/ImageUpload";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest, forceRefresh } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Event } from "@/types/schema";

export default function AdminEvents() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editEvent, setEditEvent] = useState<Event | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    venue: "",
    city: "",
    state: "",
    eventDate: "",
    registrationDeadline: "",
    registrationLink: "",
    imageUrl: "",
    isFeatured: false,
  });

  // Load events
  const { data: events = [] } = useQuery<Event[]>({
    queryKey: ["/api/events"],
  });

  // Add or Edit Event
  const saveEvent = useMutation({
    mutationFn: async () => {
      const method = editEvent ? "PATCH" : "POST";
      const url = editEvent ? `/api/events/${editEvent.id}` : "/api/events";
      const res = await apiRequest(method, url, form);
      if (!res.ok) throw new Error('Save failed');
      return res.json();
    },
    onSuccess: async () => {
      await forceRefresh(["/api/events"], queryClient);
      toast({
        title: editEvent ? "Event Updated" : "Event Added",
        description: "Event details saved successfully!",
      });
      setIsDialogOpen(false);
      setEditEvent(null);
      setForm({
        title: "",
        description: "",
        venue: "",
        city: "",
        state: "",
        eventDate: "",
        registrationDeadline: "",
        registrationLink: "",
        imageUrl: "",
        isFeatured: false,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to save event.",
        variant: "destructive",
      });
    },
  });

  // Delete Event
  const deleteEvent = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/events/${id}`);
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onSuccess: async () => {
      await forceRefresh(["/api/events"], queryClient);
      toast({
        title: "Event Deleted",
        description: "The event has been removed successfully.",
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete event.",
        variant: "destructive",
      });
    },
  });

  // Handle Form Changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const target = e.target as HTMLInputElement;
    const { name, value, type } = target;
    const checked = 'checked' in target ? target.checked : false;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleEdit = (event: Event) => {
    setEditEvent(event);
    setForm({
      title: event.title,
      description: event.description,
      venue: event.venue,
      city: event.city,
      state: event.state,
      eventDate: event.eventDate ? new Date(event.eventDate).toISOString().slice(0, 16) : "",
      registrationDeadline: event.registrationDeadline
        ? new Date(event.registrationDeadline).toISOString().slice(0, 16)
        : "",
      registrationLink: (event as any).registrationLink || "",
      imageUrl: event.imageUrl || "",
      isFeatured: event.isFeatured,
    });
    setIsDialogOpen(true);
  };

  const handleSave = () => {
    saveEvent.mutate();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Events Management</h1>
          <p className="text-muted-foreground mt-2">
            Manage upcoming events and competitions
          </p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              className="bg-primary hover:bg-primary/90"
              onClick={() => setEditEvent(null)}
              data-testid="button-add-event"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Event
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{editEvent ? "Edit Event" : "Add Event"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4 mt-4">
              {[
                { label: "Event Title *", name: "title" as const, type: "text" },
                { label: "Description *", name: "description" as const, type: "textarea" },
                { label: "Venue *", name: "venue" as const, type: "text" },
                { label: "City *", name: "city" as const, type: "text" },
                { label: "State *", name: "state" as const, type: "text" },
              ].map((field, idx) => (
                <div key={idx}>
                  <Label>{field.label}</Label>
                  {field.type === "textarea" ? (
                    <Textarea
                      name={field.name}
                      value={form[field.name] as string}
                      onChange={handleChange}
                      className="min-h-[120px]"
                    />
                  ) : (
                    <Input
                      name={field.name}
                      value={form[field.name] as string}
                      onChange={handleChange}
                    />
                  )}
                </div>
              ))}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Event Date *</Label>
                  <Input
                    type="datetime-local"
                    name="eventDate"
                    value={form.eventDate}
                    onChange={handleChange}
                  />
                </div>
                <div>
                  <Label>Registration Deadline</Label>
                  <Input
                    type="datetime-local"
                    name="registrationDeadline"
                    value={form.registrationDeadline}
                    onChange={handleChange}
                  />
                </div>
              </div>

              <div>
                <Label>Registration Link (Optional)</Label>
                <Input
                  type="url"
                  name="registrationLink"
                  placeholder="https://example.com/register"
                  value={form.registrationLink}
                  onChange={handleChange}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  If provided, the "Register Now" button will open this link
                </p>
              </div>

              <ImageUpload
                label="Event Image"
                value={form.imageUrl}
                onChange={(url) => setForm((prev) => ({ ...prev, imageUrl: url }))}
              />

              <div className="flex items-center gap-2">
                <Switch
                  checked={form.isFeatured}
                  onCheckedChange={(checked) =>
                    setForm((prev) => ({ ...prev, isFeatured: checked }))
                  }
                />
                <Label>Featured Event</Label>
              </div>

              <Button
                className="w-full bg-primary hover:bg-primary/90"
                onClick={handleSave}
                disabled={saveEvent.isPending}
              >
                {saveEvent.isPending
                  ? "Saving..."
                  : editEvent
                  ? "Update Event"
                  : "Save Event"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {events.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">
              No events yet. Click "Add Event" to create one.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {events.map((event) => (
            <Card key={event.id} className="p-4">
              <CardContent>
                <h3 className="font-bold text-lg">{event.title}</h3>
                <p className="text-sm text-muted-foreground">{event.city}, {event.state}</p>
                <div className="flex gap-3 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleEdit(event)}
                  >
                    <Pencil className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteEvent.mutate(event.id)}
                    disabled={deleteEvent.isPending}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> {deleteEvent.isPending ? "Deleting..." : "Delete"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
