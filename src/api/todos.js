const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  (import.meta.env.DEV ? "http://localhost:4000" : window.location.origin);

async function request(path, options = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message || "Something went wrong.");
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export function getTodos({ status = "all", search = "" } = {}) {
  const params = new URLSearchParams({ status, search });
  return request(`/api/todos?${params.toString()}`);
}

export function getTodo(id) {
  return request(`/api/todos/${id}`);
}

export function createTodo(todo) {
  return request("/api/todos", {
    method: "POST",
    body: JSON.stringify(todo),
  });
}

export function updateTodo(id, todo) {
  return request(`/api/todos/${id}`, {
    method: "PUT",
    body: JSON.stringify(todo),
  });
}

export function patchTodo(id, updates) {
  return request(`/api/todos/${id}`, {
    method: "PATCH",
    body: JSON.stringify(updates),
  });
}

export function deleteTodo(id) {
  return request(`/api/todos/${id}`, {
    method: "DELETE",
  });
}
