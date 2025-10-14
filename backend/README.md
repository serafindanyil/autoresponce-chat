# Backend API

This backend exposes a small REST surface under the `/api` namespace alongside a `/health` probe. Real-time chat data is delivered over Socket.IO after authentication. All REST responses are JSON using UTF-8 encoding.

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
- **Local Testing**
  - Provide `GOOGLE_TEST_TOKEN` (and optional `GOOGLE_TEST_USER_*` overrides) in `.env` to bypass Google verification and receive a signed JWT for that synthetic user.
  - On successful authentication the backend provisions a default chat roster (Ada Lovelace, Alan Turing, Grace Hopper) scoped to that user if none exists.

> All subsequent REST and socket requests must include the JWT using `Authorization: Bearer <token>` or the Socket.IO auth handshake described below.

### `POST /api/auth/logout`

Invalidates the caller session and disconnects active sockets.

- **Response 204**: No body.
- **Headers**: Requires `Authorization: Bearer <token>`.
- **Notes**: Clients should also disconnect their Socket.IO instance after receiving the 204.

## Chats

Chats are provisioned automatically for each authenticated user during login. Each seeded chat містить перше привітальне повідомлення, яке надсилає співрозмовник-бот. There is currently no REST endpoint to create additional chats; use the update and delete operations to manage metadata.

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

### `POST /api/chats`

Creates a new chat with the supplied profile metadata.

- **Request Body**
  ```json
  {
  	"firstName": "Nikola",
  	"lastName": "Tesla",
  	"metadata": {
  		"avatarUrl": "https://example.com/avatar.png"
  	}
  }
  ```
- **Response 201**
  ```json
  {
  	"_id": "<chatId>",
  	"ownerId": "<userId>",
  	"firstName": "Nikola",
  	"lastName": "Tesla",
  	"metadata": { "avatarUrl": "https://example.com/avatar.png" },
  	"createdAt": "2025-01-01T00:00:00.000Z",
  	"updatedAt": "2025-01-01T00:00:00.000Z"
  }
  ```
- **Failure Codes**
  - `400`: Validation errors.
  - `409`: Chat with the same participant already exists.

### `POST /api/chats/:chatId/messages`

Creates a message in the chat owned by the authenticated user. When `isBot` is `false`, the auto-reply service schedules an automated response.

- **Request Body**
  ```json
  {
  	"text": "Hello"
  }
  ```
- **Notes**: The backend automatically uses the authenticated user's profile for `authorName` and `authorUserId`.

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

### `DELETE /api/messages/:messageId`

Removes a message owned by the authenticated user.

- **Response 204**: No body.
- **Failure Codes**
  - `400`: Invalid `messageId` format.
  - `404`: Message not found or chat not owned by the user.

## Real-Time Events

Chat state is synchronized over Socket.IO authenticated with the same JWT you receive from the auth endpoint.

- **Handshake**

  ```ts
  import { io } from "socket.io-client";

  const socket = io("http://localhost:4000", {
  	auth: { token: "<jwt>" },
  });
  ```

- **Rooms**: The server automatically joins the socket to a user-scoped room (`user:<userId>`).

### `chats:bootstrap`

Fired once immediately after a socket connects successfully. The payload is a list of all chats (including the three defaults created on first login) with their current messages.

```json
[
	{
		"chat": {
			"_id": "<chatId>",
			"ownerId": "<userId>",
			"firstName": "Ada",
			"lastName": "Lovelace",
			"metadata": { "avatarUrl": null },
			"createdAt": "2025-01-01T00:00:00.000Z",
			"updatedAt": "2025-01-01T00:00:00.000Z"
		},
		"messages": []
	}
]
```

### `chats:patch`

Emitted every time a chat or message changes (manual, auto-reply, or broadcast). The payload contains only the affected chat so clients can apply targeted updates.

```json
{
	"chatId": "<chatId>",
	"chat": {
		"_id": "<chatId>",
		"ownerId": "<userId>",
		"firstName": "Ada",
		"lastName": "Lovelace",
		"metadata": { "avatarUrl": null },
		"createdAt": "2025-01-01T00:00:00.000Z",
		"updatedAt": "2025-01-01T00:01:00.000Z"
	},
	"messages": [
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
		},
		{
			"_id": "<messageId2>",
			"chatId": "<chatId>",
			"text": "Keep learning — Test Bot",
			"author": {
				"name": "Quote Bot",
				"userId": null,
				"isBot": true
			},
			"createdAt": "2025-01-01T00:00:03.000Z",
			"updatedAt": "2025-01-01T00:00:03.000Z"
		}
	]
}
```

If a chat is deleted the server emits `{ "chatId": "<chatId>", "removed": true }` using the same event so clients can drop it locally.

### `notification`

Used for system-wide notices (e.g., broadcasting auto bot status toggles). Payload shape varies.

### `toggle:autoBot`

Client-emitted event to enable or disable scheduled broadcast messages. Send `true` or `false` as the payload; the server replies with a `notification` event indicating the current state.

### Socket Patch Semantics

The `chats:patch` event payload reflects real-time changes:

- **Removed Chat Payload**: `{ "chatId": "<chatId>", "removed": true }`
- **Removed Message Payload**:
  ```json
  {
  	"chatId": "<chatId>",
  	"messageId": "<messageId>",
  	"removed": true
  }
  ```
- **Message Upsert Payload**: Emits the full message document whenever text changes.
