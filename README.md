# TodoListAA

[![Deploy to Render](https://render.com/images/deploy-to-render.svg)](https://render.com/deploy?repo=https://github.com/himanshu952354/TodoListAA)

TodoApp is a full-stack todo application built for Challenge 2. It uses a React frontend with separate pages and an Express backend with CRUD APIs. Todo data is stored in `data/todos.json`.

## Pages

- `index.html`: todo list page for creating, searching, filtering, editing, completing, and deleting todos.
- `todo.html?id=<todo-id>`: single todo item page that reads the todo id from the query string and displays the full details.

## Features

- Create todos with title, description, due date, and priority.
- View todos in a responsive list.
- Search todos by title or description.
- Filter todos by all, active, or completed status.
- Mark todos complete or active.
- Edit existing todo content from the list page.
- Delete todos from either page.
- Open a dedicated detail page for each todo.
- See todo metadata including id, status, priority, due date, created date, and updated date.
- File-backed persistence using JSON.

## Tech Stack

- React
- Vite
- Node.js
- Express.js
- JSON file storage

## Setup

Install dependencies:

```bash
npm install
```

Run the backend API:

```bash
npm run dev:api
```

In a second terminal, run the frontend:

```bash
npm run dev:web
```

The frontend runs at `http://127.0.0.1:5173` and the backend runs at `http://localhost:4000`.

## Production Build

Build the frontend:

```bash
npm run build
```

Start the Express app:

```bash
npm start
```

The Express app serves the API and, when `dist` exists, the built frontend.

## API Endpoints

See [docs/API.md](docs/API.md) for the CRUD API details.
