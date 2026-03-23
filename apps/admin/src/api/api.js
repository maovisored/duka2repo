const API_URL = import.meta.env.VITE_API_URL;

export async function apiFetch(url, options = {}) {
  const token = localStorage.getItem("duka2_token");

  return fetch(`${API_URL}${url}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
      ...options.headers,
    },
  });
}