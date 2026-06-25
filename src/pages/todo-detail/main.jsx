import React, { useEffect, useState } from "react";
import { createRoot } from "react-dom/client";
import { deleteTodo, getTodo, patchTodo } from "../../api/todos";
import "../../styles.css";

function formatDate(value) {
  if (!value) return "Not set";
  return new Date(value).toLocaleDateString(undefined, {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function TodoDetailPage() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get("id");
  const [todo, setTodo] = useState(null);
  const [loading, setLoading] = useState(Boolean(id));
  const [error, setError] = useState(id ? "" : "Add a todo id in the page URL to view details.");

  async function loadTodo() {
    if (!id) return;

    setLoading(true);
    setError("");
    try {
      setTodo(await getTodo(id));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTodo();
  }, [id]);

  async function toggleComplete() {
    const updated = await patchTodo(todo.id, { completed: !todo.completed });
    setTodo(updated);
  }

  async function removeTodo() {
    const confirmed = window.confirm(`Delete "${todo.title}"?`);
    if (!confirmed) return;

    await deleteTodo(todo.id);
    window.location.href = "/";
  }

  return (
    <div className="app-shell">
      <div className="page">
        <header className="topbar">
          <div className="title-block">
            <h1>Todo Details</h1>
            <p>Single todo page powered by the id query parameter.</p>
          </div>
          <a className="ghost-button" href="/">
            Back to list
          </a>
        </header>

        {loading && <div className="empty-state">Loading todo...</div>}
        {error && <div className="error-state">{error}</div>}

        {todo && (
          <article className="detail-panel">
            <div className="meta-row">
              <span className={`badge ${todo.priority}`}>{todo.priority}</span>
              <span className="badge">{todo.completed ? "completed" : "active"}</span>
            </div>

            <div>
              <h2 className="todo-title">{todo.title}</h2>
              <p className="detail-description">
                {todo.description || "No description has been added for this todo."}
              </p>
            </div>

            <div className="detail-grid">
              <div className="detail-item">
                <span>Todo id</span>
                <strong>{todo.id}</strong>
              </div>
              <div className="detail-item">
                <span>Due date</span>
                <strong>{formatDate(todo.dueDate)}</strong>
              </div>
              <div className="detail-item">
                <span>Created</span>
                <strong>{formatDate(todo.createdAt)}</strong>
              </div>
              <div className="detail-item">
                <span>Updated</span>
                <strong>{formatDate(todo.updatedAt)}</strong>
              </div>
            </div>

            <div className="actions">
              <button className="primary-button" type="button" onClick={toggleComplete}>
                Mark {todo.completed ? "active" : "completed"}
              </button>
              <a className="secondary-button" href={`/?search=${encodeURIComponent(todo.title)}`}>
                Find in list
              </a>
              <button className="danger-button" type="button" onClick={removeTodo}>
                Delete
              </button>
            </div>
          </article>
        )}
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<TodoDetailPage />);
