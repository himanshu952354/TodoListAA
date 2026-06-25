import cors from "cors";
import express from "express";
import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, "..");
const dataDir = path.join(rootDir, "data");
const dataFile = path.join(dataDir, "todos.json");
const port = process.env.PORT || 4000;

export const app = express();

app.use(cors());
app.use(express.json());

async function ensureDataFile() {
  await mkdir(dataDir, { recursive: true });

  if (!existsSync(dataFile)) {
    await writeFile(dataFile, "[]\n", "utf8");
  }
}

async function readTodos() {
  await ensureDataFile();
  const raw = await readFile(dataFile, "utf8");
  return JSON.parse(raw || "[]");
}

async function writeTodos(todos) {
  await ensureDataFile();
  await writeFile(dataFile, `${JSON.stringify(todos, null, 2)}\n`, "utf8");
}

function normalizeTodoPayload(payload, existing = {}) {
  const title = typeof payload.title === "string" ? payload.title.trim() : existing.title;

  if (!title) {
    const error = new Error("Title is required.");
    error.status = 400;
    throw error;
  }

  const priority = ["low", "medium", "high"].includes(payload.priority)
    ? payload.priority
    : existing.priority || "medium";

  return {
    title,
    description:
      typeof payload.description === "string"
        ? payload.description.trim()
        : existing.description || "",
    dueDate:
      typeof payload.dueDate === "string" && payload.dueDate.trim()
        ? payload.dueDate
        : payload.dueDate === null
          ? ""
          : existing.dueDate || "",
    priority,
    completed:
      typeof payload.completed === "boolean" ? payload.completed : Boolean(existing.completed),
  };
}

app.get("/api/health", (_request, response) => {
  response.json({ ok: true });
});

app.get("/api/todos", async (request, response, next) => {
  try {
    let todos = await readTodos();
    const status = String(request.query.status || "all");
    const search = String(request.query.search || "").trim().toLowerCase();

    if (status === "active") {
      todos = todos.filter((todo) => !todo.completed);
    }

    if (status === "completed") {
      todos = todos.filter((todo) => todo.completed);
    }

    if (search) {
      todos = todos.filter((todo) =>
        `${todo.title} ${todo.description}`.toLowerCase().includes(search),
      );
    }

    response.json(todos);
  } catch (error) {
    next(error);
  }
});

app.get("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const todo = todos.find((item) => item.id === request.params.id);

    if (!todo) {
      response.status(404).json({ message: "Todo not found." });
      return;
    }

    response.json(todo);
  } catch (error) {
    next(error);
  }
});

app.post("/api/todos", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const now = new Date().toISOString();
    const todo = {
      id: crypto.randomUUID(),
      ...normalizeTodoPayload(request.body),
      createdAt: now,
      updatedAt: now,
    };

    todos.unshift(todo);
    await writeTodos(todos);
    response.status(201).json(todo);
  } catch (error) {
    next(error);
  }
});

app.put("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === request.params.id);

    if (index === -1) {
      response.status(404).json({ message: "Todo not found." });
      return;
    }

    const updated = {
      ...todos[index],
      ...normalizeTodoPayload(request.body, todos[index]),
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    await writeTodos(todos);
    response.json(updated);
  } catch (error) {
    next(error);
  }
});

app.patch("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const index = todos.findIndex((item) => item.id === request.params.id);

    if (index === -1) {
      response.status(404).json({ message: "Todo not found." });
      return;
    }

    const updated = {
      ...todos[index],
      ...normalizeTodoPayload({ ...todos[index], ...request.body }, todos[index]),
      updatedAt: new Date().toISOString(),
    };

    todos[index] = updated;
    await writeTodos(todos);
    response.json(updated);
  } catch (error) {
    next(error);
  }
});

app.delete("/api/todos/:id", async (request, response, next) => {
  try {
    const todos = await readTodos();
    const nextTodos = todos.filter((item) => item.id !== request.params.id);

    if (nextTodos.length === todos.length) {
      response.status(404).json({ message: "Todo not found." });
      return;
    }

    await writeTodos(nextTodos);
    response.status(204).send();
  } catch (error) {
    next(error);
  }
});

const distDir = path.join(rootDir, "dist");

if (existsSync(distDir)) {
  app.use(express.static(distDir));
  app.get("/", (_request, response) => {
    response.sendFile(path.join(distDir, "index.html"));
  });
  app.get(["/todo", "/todo.html"], (_request, response) => {
    response.sendFile(path.join(distDir, "todo.html"));
  });
}

app.use((error, _request, response, _next) => {
  response.status(error.status || 500).json({
    message: error.message || "Unexpected server error.",
  });
});

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  app.listen(port, () => {
    console.log(`Todo API running on http://localhost:${port}`);
  });
}
