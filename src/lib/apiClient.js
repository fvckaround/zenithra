"use client";

// Thin wrapper around fetch for same-origin JSON API calls. Throws an Error
// with the server's message on non-2xx responses.
export async function apiFetch(path, { method = "GET", body, ...rest } = {}) {
  const res = await fetch(path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "same-origin",
    ...rest,
  });

  let data = null;
  try {
    data = await res.json();
  } catch {
    // non-JSON response
  }

  if (!res.ok || (data && data.ok === false)) {
    const message = data?.error || `Request failed (${res.status})`;
    const err = new Error(message);
    err.data = data;
    err.status = res.status;
    throw err;
  }

  return data;
}
