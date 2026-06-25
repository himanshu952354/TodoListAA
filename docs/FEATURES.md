# Feature Documentation

## Todo List Page

The todo list page is the main working area of the application. It supports the following actions:

- Add a todo with a title, description, due date, and priority.
- Edit an existing todo by loading it back into the form.
- Delete a todo after confirmation.
- Toggle a todo between active and completed.
- Search todos by title and description.
- Filter todos by all, active, or completed.
- Open the detail page for a specific todo.

## Todo Detail Page

The detail page is a separate page, not a client-side route. It expects a query parameter:

```text
todo.html?id=<todo-id>
```

It shows:

- Todo title and description.
- Todo id.
- Priority.
- Completion status.
- Due date.
- Created date.
- Updated date.

It also allows users to mark the todo active or completed and delete the todo.

## Persistence

Todos are saved in `data/todos.json`. The Express server reads from and writes to this file for every API operation, so data survives page refreshes and server restarts.

## Validation

The backend requires every todo to have a non-empty title. Priority values are limited to:

- `low`
- `medium`
- `high`
