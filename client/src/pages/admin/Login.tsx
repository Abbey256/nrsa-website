"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

/**
 * Admin Login Component
 * 
 * Handles administrator authentication using JWT tokens.
 * 
 * Default Admin Credentials (auto-created on server startup):
 * - Email: admin1@nrsa.com.ng
 * - Password: adminpassme2$
 * 
 * Authentication Flow:
 * 1. User enters email and password
 * 2. Sends POST request to /api/admin/login
 * 3. Backend validates credentials and returns JWT token (see server/auth.ts)
 * 4. Token is stored in localStorage as 'adminToken'
 * 5. Redirects to /admin-nrsa-dashboard
 * 6. AdminLayout checks for token on protected routes
 */
export default function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    try {
      // Send login request to backend API
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Login failed");

      // Store JWT token in localStorage for subsequent API requests
      localStorage.setItem("adminToken", data.token);
      
      // Redirect to admin dashboard (route fixed in App.tsx)
      window.location.href = "/admin-nrsa-dashboard";
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-32 p-6 border rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Admin Login</h1>
      {error && <div className="text-red-500 mb-4">{error}</div>}
      <form onSubmit={handleLogin} className="space-y-4">
        <div>
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            data-testid="input-admin-email"
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input 
            id="password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            data-testid="input-admin-password"
          />
        </div>
        <Button 
          type="submit" 
          className="w-full" 
          data-testid="button-admin-login"
        >
          Login
        </Button>
      </form>
    </div>
  );
}