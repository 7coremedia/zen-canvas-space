// Lightweight API client that works with either:
// - Absolute base URL via VITE_API_URL
// - Or a Vite dev proxy mounted at /api (see vite.config.ts)

type JsonValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | JsonValue[]
  | { [key: string]: JsonValue };

const API_BASE_URL = import.meta.env.VITE_API_URL as string | undefined;

function buildUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (API_BASE_URL) return `${API_BASE_URL}${normalized}`;
  // Fall back to dev proxy prefix
  return `/api${normalized}`;
}

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const { headers, body, ...rest } = options;

  const isFormData = typeof FormData !== "undefined" && body instanceof FormData;
  const mergedHeaders: HeadersInit = {
    ...(isFormData ? {} : { "Content-Type": "application/json" }),
    ...(headers || {}),
  };

  const response = await fetch(buildUrl(path), {
    method: rest.method ?? (body ? "POST" : "GET"),
    headers: mergedHeaders,
    body: isFormData ? (body as BodyInit) : body ? JSON.stringify(body) : undefined,
    ...rest,
  });

  const contentType = response.headers.get("content-type") || "";
  const isJson = contentType.includes("application/json");

  if (!response.ok) {
    let errorPayload: unknown = undefined;
    try {
      errorPayload = isJson ? await response.json() : await response.text();
    } catch {
      // ignore parsing errors
    }
    const error = new Error(
      `API request failed: ${response.status} ${response.statusText}`
    ) as Error & { status?: number; payload?: unknown };
    error.status = response.status;
    error.payload = errorPayload;
    throw error;
  }

  return (isJson ? await response.json() : (await response.text())) as T;
}

export const api = {
  get: <T = unknown>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...(init || {}), method: "GET" }),
  post: <T = unknown>(path: string, data?: JsonValue, init?: RequestInit) =>
    apiFetch<T>(path, { ...(init || {}), method: "POST", body: data as any }),
  put: <T = unknown>(path: string, data?: JsonValue, init?: RequestInit) =>
    apiFetch<T>(path, { ...(init || {}), method: "PUT", body: data as any }),
  patch: <T = unknown>(path: string, data?: JsonValue, init?: RequestInit) =>
    apiFetch<T>(path, { ...(init || {}), method: "PATCH", body: data as any }),
  delete: <T = unknown>(path: string, init?: RequestInit) =>
    apiFetch<T>(path, { ...(init || {}), method: "DELETE" }),
};

