const API_BASE = import.meta.env.VITE_API_URL || "";

function buildUrl(url: string) {
  if (/^https?:\/\//i.test(url)) return url;
  const base = API_BASE.replace(/\/$/, "");
  return base + (url.startsWith("/") ? url : "/" + url);
}

function getAuthHeaders(): Record<string, string> {
  const token = localStorage.getItem("adminToken");
  const headers: Record<string, string> = {};
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  return headers;
}

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

  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }

  return res;
}

export function forceRefresh() {
  // No-op function for compatibility
}
