# API Documentation

Base URL: `http://localhost:4000`

## Todo Shape

```json
{
  "id": "sample-plan",
  "title": "Plan the weekly tasks",
  "description": "Write down the important tasks for this week.",
  "dueDate": "2026-06-30",
  "priority": "high",
  "completed": false,
  "createdAt": "2026-06-25T09:00:00.000Z",
  "updatedAt": "2026-06-25T09:00:00.000Z"
}
```

## Endpoints

### Health Check

`GET /api/health`

Returns:

```json
{ "ok": true }
```

### List Todos

`GET /api/todos`

Optional query parameters:

- `status`: `all`, `active`, or `completed`
- `search`: text matched against title and description

Example:

```bash
curl "http://localhost:4000/api/todos?status=active&search=plan"
```

### Get One Todo

`GET /api/todos/:id`

Returns one todo by id. Responds with `404` when the todo does not exist.

### Create Todo

`POST /api/todos`

Request body:

```json
{
  "title": "Book tickets",
  "description": "Find evening options",
  "dueDate": "2026-07-01",
  "priority": "medium",
  "completed": false
}
```

`title` is required. `priority` can be `low`, `medium`, or `high`.

### Replace Todo

`PUT /api/todos/:id`

Updates editable todo fields. The id, created timestamp, and updated timestamp are managed by the server.

### Partially Update Todo

`PATCH /api/todos/:id`

Useful for small changes such as completion status.

Example:

```json
{
  "completed": true
}
```

### Delete Todo

`DELETE /api/todos/:id`

Deletes the todo and returns `204 No Content`.
