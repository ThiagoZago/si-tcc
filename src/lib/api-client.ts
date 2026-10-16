export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`/api/${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...options.headers },
    cache: "no-store",
  });
  const data = await response.json();
  if (!response.ok) {
    if (response.status === 401 && path.startsWith("dashboard"))
      window.location.assign(new URL("/acesso", window.location.origin));
    throw new Error(data.message ?? "Não foi possível conectar ao servidor.");
  }
  return data as T;
}
