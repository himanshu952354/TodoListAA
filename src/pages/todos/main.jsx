import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import { createTodo, deleteTodo, getTodos, patchTodo, updateTodo } from "../../api/todos";
import "../../styles.css";

const emptyForm = {
  title: "",
  description: "",
  dueDate: "",
  priority: "medium",
};

function TodoListPage() {
  const [todos, setTodos] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [status, setStatus] = useState("all");
  const [search, setSearch] = useState(() => new URLSearchParams(window.location.search).get("search") || "");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadTodos() {
    setLoading(true);
    setError("");
    try {
      setTodos(await getTodos({ status, search }));
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    const handle = window.setTimeout(loadTodos, 200);
    return () => window.clearTimeout(handle);
  }, [status, search]);

  const stats = useMemo(() => {
    const completed = todos.filter((todo) => todo.completed).length;
    return {
      total: todos.length,
      completed,
      active: todos.length - completed,
    };
  }, [todos]);

  function updateForm(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function startEdit(todo) {
    setEditingId(todo.id);
    setForm({
      title: todo.title,
      description: todo.description,
      dueDate: todo.dueDate,
      priority: todo.priority,
    });
  }

  function resetForm() {
    setEditingId(null);
    setForm(emptyForm);
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    try {
      if (editingId) {
        await updateTodo(editingId, form);
      } else {
        await createTodo(form);
      }

      resetForm();
      await loadTodos();
    } catch (submitError) {
      setError(submitError.message);
    }
  }

  async function toggleComplete(todo) {
    await patchTodo(todo.id, { completed: !todo.completed });
    await loadTodos();
  }

  async function removeTodo(todo) {
    const confirmed = window.confirm(`Delete "${todo.title}"?`);
    if (!confirmed) return;

    await deleteTodo(todo.id);
    await loadTodos();
  }

  return (
    <div className="app-shell">
      <div className="page">
        <header className="topbar">
          <div className="title-block">
            <h1>Todo Board</h1>
            <p>
              {stats.total} shown · {stats.active} active · {stats.completed} done
            </p>
          </div>
          <a className="ghost-button" href="/todo.html">
            Open detail page
          </a>
        </header>

        <section className="layout">
          <aside className="panel">
            <form className="form" onSubmit={handleSubmit}>
              <label className="field">
                <span>Title</span>
                <input
                  required
                  value={form.title}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Add a clear task title"
                />
              </label>

              <label className="field">
                <span>Description</span>
                <textarea
                  value={form.description}
                  onChange={(event) => updateForm("description", event.target.value)}
                  placeholder="Add notes, context, or next steps"
                />
              </label>

              <div className="form-row">
                <label className="field">
                  <span>Due date</span>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={(event) => updateForm("dueDate", event.target.value)}
                  />
                </label>

                <label className="field">
                  <span>Priority</span>
                  <select
                    value={form.priority}
                    onChange={(event) => updateForm("priority", event.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </label>
              </div>

              <button className="primary-button" type="submit">
                {editingId ? "Save changes" : "Add todo"}
              </button>
              {editingId && (
                <button className="ghost-button" type="button" onClick={resetForm}>
                  Cancel edit
                </button>
              )}
            </form>
          </aside>

          <section>
            <div className="toolbar">
              <input
                className="search-input"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search todos"
              />
              <div className="filters" aria-label="Todo filters">
                {["all", "active", "completed"].map((filter) => (
                  <button
                    className={`filter-button ${status === filter ? "active" : ""}`}
                    key={filter}
                    type="button"
                    onClick={() => setStatus(filter)}
                  >
                    {filter}
                  </button>
                ))}
              </div>
            </div>

            {error && <div className="error-state">{error}</div>}
            {loading && <div className="empty-state">Loading todos...</div>}
            {!loading && !todos.length && <div className="empty-state">No todos match this view.</div>}

            <div className="todo-list">
              {todos.map((todo) => (
                <article className={`todo-card ${todo.completed ? "completed" : ""}`} key={todo.id}>
                  <div className="todo-main">
                    <input
                      aria-label={`Mark ${todo.title} complete`}
                      className="todo-checkbox"
                      checked={todo.completed}
                      type="checkbox"
                      onChange={() => toggleComplete(todo)}
                    />
                    <div>
                      <h2 className="todo-title">{todo.title}</h2>
                      {todo.description && <p className="todo-description">{todo.description}</p>}
                    </div>
                    <span className={`badge ${todo.priority}`}>{todo.priority}</span>
                  </div>

                  <div className="meta-row">
                    <span className="badge">{todo.completed ? "completed" : "active"}</span>
                    {todo.dueDate && <span className="badge">due {todo.dueDate}</span>}
                  </div>

                  <div className="actions">
                    <a className="secondary-button" href={`/todo.html?id=${todo.id}`}>
                      View
                    </a>
                    <button className="toggle-button" type="button" onClick={() => startEdit(todo)}>
                      Edit
                    </button>
                    <button className="danger-button" type="button" onClick={() => removeTodo(todo)}>
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </section>
      </div>
    </div>
  );
}

createRoot(document.getElementById("root")).render(<TodoListPage />);
