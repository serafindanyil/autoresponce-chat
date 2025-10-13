# Backend API

This backend exposes REST endpoints under the `/api` namespace alongside a `/health` probe. All responses are JSON. Unless noted otherwise, requests and responses use UTF-8 encoded JSON bodies.

## Base URLs

- Local development: `http://localhost:4000`
- API root: `http://localhost:4000/api`

## Common Conventions

- `id` fields are MongoDB ObjectId strings.
- Validation errors return `400` with the shape:

```json
{
	"message": "Validation failed",
	"errors": {
		"fieldErrors": {
			"fieldName": ["message"]
		}
	}
}
```

- Errors referencing missing resources use `404` with `{ "message": "..." }`.

## Health

### `GET /health`

Health probe used by orchestration to confirm process liveness.

- **Response 200**
  ```json
  { "status": "healthy" }
  ```

## Diagnostics

### `GET /api/test`

Returns diagnostic status plus current user count (used during seed validation).

- **Response 200**
  ```json
  {
  	"status": "ok",
  	"message": "Test endpoint is reachable.",
  	"totalUsers": 0
  }
  ```

## Authentication

### `POST /api/auth/google`

Exchanges a Google ID token for a signed JWT and user payload. Requires Google OAuth to be configured in environment variables.

- **Request Body**
  ```json
  { "token": "<google-id-token>" }
  ```
- **Response 200**
  ```json
  {
  	"token": "<jwt>",
  	"user": {
  		"id": "<userId>",
  		"email": "user@example.com",
  		"name": "Display Name"
  	}
  }
  ```
- **Failure Codes**
  - `400`: Invalid or missing token payload.
  - `500`: Google OAuth not configured via env vars.

## Chats

### `GET /api/chats`

Lists chats ordered by last update descending.

- **Response 200**
  ```json
  [
  	{
  		"_id": "<chatId>",
  		"firstName": "Ada",
  		"lastName": "Lovelace",
  		"metadata": { "avatarUrl": "https://..." },
  		"createdAt": "2025-01-01T00:00:00.000Z",
  		"updatedAt": "2025-01-01T00:00:00.000Z"
  	}
  ]
  ```

### `POST /api/chats`

Creates a chat participant profile.

- **Request Body**
  ```json
  {
  	"firstName": "Ada",
  	"lastName": "Lovelace",
  	"metadata": {
  		"avatarUrl": "https://..."
  	}
  }
  ```
- **Response 201**: Returns newly created chat document.
- **Failure Codes**: `400` validation errors.

### `PUT /api/chats/:chatId`

Partial update for a chat.

- **Request Body**: Same schema as creation, all fields optional.
- **Response 200**: Updated chat.
- **Failure Codes**
  - `400`: Invalid `chatId` format.
  - `404`: Chat not found.

### `DELETE /api/chats/:chatId`

Deletes a chat by identifier.

- **Response 204**: No body.
- **Failure Codes**
  - `400`: Invalid `chatId` format.
  - `404`: Chat not found.

### `GET /api/chats/:chatId/messages`

Retrieves all messages for a chat sorted by creation timestamp ascending.

- **Response 200**
  ```json
  [
  	{
  		"_id": "<messageId>",
  		"chatId": "<chatId>",
  		"text": "Hello",
  		"author": {
  			"name": "Ada",
  			"userId": "<userId>",
  			"isBot": false
  		},
  		"createdAt": "2025-01-01T00:00:00.000Z",
  		"updatedAt": "2025-01-01T00:00:00.000Z"
  	}
  ]
  ```
- **Failure Codes**: `400` when `chatId` is not a valid ObjectId.

### `POST /api/chats/:chatId/messages`

Creates a message for the chat. When `isBot` is `false`, the auto-reply service schedules a bot response.

- **Request Body**
  ```json
  {
  	"text": "Hello",
  	"authorName": "Ada",
  	"authorUserId": "<userId>",
  	"isBot": false
  }
  ```
- **Response 201**: Created message document.
- **Failure Codes**
  - `400`: Invalid `chatId`, `authorUserId`, or payload.
  - `404`: Chat not found (if future validation added).

## Messages

### `PUT /api/messages/:messageId`

Updates message text.

- **Request Body**
  ```json
  { "text": "Updated message" }
  ```
- **Response 200**: Updated message document.
- **Failure Codes**
  - `400`: Invalid `messageId` format or payload validation errors.
  - `404`: Message not found.

## Real-Time Events

Although not required to consume REST endpoints, the Socket.IO server emits real-time updates using these channels when active:

- `chat:created`, `chat:updated`, `chat:deleted`
- `message:new`, `message:edited`
- `notification`

Clients should connect to the same origin (`ws://localhost:4000`) and join the relevant `chatId` room to receive message events.
