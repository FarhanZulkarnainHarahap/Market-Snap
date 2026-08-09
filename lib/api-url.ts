const defaultApiUrl = "https://api-node.market-snap.web.id";

export function apiUrl(path = ""): string {
  const baseUrl = normalizeApiBase(process.env.NEXT_PUBLIC_API_URL ?? defaultApiUrl);
  if (!path) return baseUrl;
  return `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;
}

function normalizeApiBase(value: string): string {
  return value.trim().replace(/\/+$/, "").replace(/\/api$/, "");
}
