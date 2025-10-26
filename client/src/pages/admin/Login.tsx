"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Save token to localStorage
      localStorage.setItem("adminToken", data.token);
      window.location.href = "/admin-nrsa-dashboard"; // redirect to admin dashboard
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 border rounded shadow space-y-4">
      <h1 className="text-2xl font-bold">Admin Login</h1>
      {error && <div className="text-red-500">{error}</div>}
      <div>
        <Label>Email</Label>
        <Input value={email} onChange={e => setEmail(e.target.value)} />
      </div>
      <div>
        <Label>Password</Label>
        <Input type="password" value={password} onChange={e => setPassword(e.target.value)} />
      </div>
      <Button className="w-full" onClick={handleLogin}>Login</Button>
    </div>
  );
}