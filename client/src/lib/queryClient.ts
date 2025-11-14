import { QueryClient, QueryFunction } from "@tanstack/react-query";

/**
 * API base configuration:
 * - Development: Empty string (same-origin proxy via Vite)
 * - Production (Render): Empty string (same-origin - frontend and backend on same service)
 * - Production (cPanel): Set VITE_API_URL to backend subdomain (e.g., https://api.nrsa.com.ng)
 * 
 * For Render deployment: Leave VITE_API_URL unset for same-origin API calls
 * For cPanel split deployment: Set VITE_API_URL=https://api.nrsa.com.ng
 */
const API_BASE = import.meta.env.PROD 
  ? "https://api.nrsa.com.ng" 
  : (import.meta.env.VITE_API_URL as string | undefined) || "";

// Build full URL: if absolute return it as-is, otherwise prefix with API_BASE
function buildUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE.replace(/\/$/, "");
  return base + (url.startsWith("/") ? url : "/" + url);
}

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

/**
 * Generic API request used by admin mutations and pages that call apiRequest directly.
 * Returns a Response (caller can call .json()) and throws for non-ok responses.
 */
export async function apiRequest(
  method: string,
  url: string,
  data?: unknown | undefined,
): Promise<Response> {
  const authHeaders = getAuthHeaders();
  const headers = {
    ...(data ? { "Content-Type": "application/json" } : {}),
    ...authHeaders,
  };

  const fullUrl = buildUrl(url);

  const res = await fetch(fullUrl, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  await throwIfResNotOk(res);
  return res;
}

/**
 * Default query function factory for use with react-query.
 * It expects queryKey arrays like ["/api/news"] or ["api", "news"] (the code joins keys with "/").
 * on401:
 *  - "returnNull" => if server returns 401, return null (used by some pages)
 *  - "throw" => throw an error (default)
 */
type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const authHeaders = getAuthHeaders();
    // join queryKey into a path; the codebase uses queryKey like ["/api/news"]
    const path = Array.isArray(queryKey) ? queryKey.join("/") : String(queryKey);
    const fullUrl = buildUrl(path);

    const res = await fetch(fullUrl, {
      credentials: "include",
      headers: authHeaders,
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null as unknown as T;
    }

    await throwIfResNotOk(res);
    return await res.json() as T;
  };

/**
 * QueryClient with a default queryFn so existing useQuery({ queryKey: ["/api/news"] }) works without passing queryFn.
 * We set on401 behavior to "throw" for default queries.
 */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 10 * 60 * 1000,
      gcTime: 15 * 60 * 1000,
    },
  },
});