import React from "react";
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Shield, ShieldCheck } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

type Admin = {
  id: number;
  name: string;
  email: string;
  role: "super-admin" | "admin";
  protected: boolean;
  createdAt: string;
};

export default function AdminManagement() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "admin" as "super-admin" | "admin",
  });

  const currentAdmin = JSON.parse(localStorage.getItem("admin") || "{}");
  const isSuperAdmin = currentAdmin.role === "super-admin";

  const { data: admins = [], isLoading } = useQuery<Admin[]>({
    queryKey: ["/api/admins"],
  });

  const createAdmin = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", "/api/admins", form);
      if (!res.ok) throw new Error('Create failed');
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admins"] });
      toast({
        title: "Admin Created",
        description: "New admin account created successfully!",
      });
      setOpen(false);
      setForm({ name: "", email: "", password: "", role: "admin" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to create admin.",
        variant: "destructive",
      });
    },
  });

  const deleteAdmin = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest("DELETE", `/api/admins/${id}`);
      if (!res.ok) throw new Error('Delete failed');
      return id;
    },
    onMutate: async (deletedId) => {
      await queryClient.cancelQueries({ queryKey: ["/api/admins"] });
      const previousAdmins = queryClient.getQueryData(["/api/admins"]);
      queryClient.setQueryData(["/api/admins"], (old: Admin[] = []) => 
        old.filter(item => item.id !== deletedId)
      );
      return { previousAdmins };
    },
    onError: (error, deletedId, context) => {
      queryClient.setQueryData(["/api/admins"], context?.previousAdmins);
      toast({
        title: "Error",
        description: error.message || "Failed to delete admin.",
        variant: "destructive",
      });
    },
    onSuccess: () => {
      toast({
        title: "Admin Deleted",
        description: "Admin account removed successfully.",
      });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admins"] });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast({
        title: "Validation Error",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }
    createAdmin.mutate();
  };

  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this admin account?")) {
      deleteAdmin.mutate(id);
    }
  };

  if (!isSuperAdmin) {
    return (
      <div>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage administrator accounts</p>
        </div>
        <Card>
          <CardContent className="py-12 text-center">
            <Shield className="w-12 h-12 mx-auto mb-4 text-muted-foreground" />
            <p className="text-muted-foreground">
              Only super-admins can manage administrator accounts.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-foreground" data-testid="text-page-title">
            Admin Management
          </h1>
          <p className="text-muted-foreground mt-2">Manage administrator accounts</p>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button data-testid="button-create-admin">
              <Plus className="w-4 h-4 mr-2" /> Add Admin
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Admin</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Admin name"
                  data-testid="input-admin-name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="admin@nrsa.com.ng"
                  data-testid="input-admin-email"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Secure password"
                  data-testid="input-admin-password"
                  required
                />
              </div>
              <div>
                <Label htmlFor="role">Role</Label>
                <Select 
                  value={form.role} 
                  onValueChange={(value: "admin" | "super-admin") => setForm({ ...form, role: value })}
                >
                  <SelectTrigger data-testid="select-admin-role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="super-admin">Super Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setOpen(false)}
                  data-testid="button-cancel"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={createAdmin.isPending}
                  data-testid="button-submit-admin"
                >
                  {createAdmin.isPending ? "Creating..." : "Create Admin"}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <Card>
          <CardContent className="py-12 text-center">
            <p className="text-muted-foreground">Loading admins...</p>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {admins.map((admin) => (
                <TableRow key={admin.id} data-testid={`row-admin-${admin.id}`}>
                  <TableCell className="font-medium" data-testid={`text-admin-name-${admin.id}`}>
                    {admin.name}
                  </TableCell>
                  <TableCell data-testid={`text-admin-email-${admin.id}`}>
                    {admin.email}
                  </TableCell>
                  <TableCell>
                    <Badge 
                      variant={admin.role === "super-admin" ? "default" : "secondary"}
                      data-testid={`badge-admin-role-${admin.id}`}
                    >
                      {admin.role === "super-admin" ? (
                        <><ShieldCheck className="w-3 h-3 mr-1" /> Super Admin</>
                      ) : (
                        <><Shield className="w-3 h-3 mr-1" /> Admin</>
                      )}
                    </Badge>
                  </TableCell>
                  <TableCell data-testid={`text-admin-created-${admin.id}`}>
                    {new Date(admin.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    {admin.id !== currentAdmin.id && !admin.protected && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleDelete(admin.id)}
                        disabled={deleteAdmin.isPending}
                        data-testid={`button-delete-admin-${admin.id}`}
                      >
                        <Trash2 className="w-4 h-4 mr-1" /> Delete
                      </Button>
                    )}
                    {admin.protected && (
                      <span className="text-xs text-muted-foreground italic">Protected</span>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </div>
  );
}
