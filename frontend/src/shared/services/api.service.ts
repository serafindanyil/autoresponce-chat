import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import type {
	Chat,
	CreateChatRequest,
	CreateMessageRequest,
	Message,
	UpdateChatRequest,
	UpdateMessageRequest,
} from "@/shared/types";
import type { RootState } from "@/shared/store";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export const apiService = createApi({
	reducerPath: "api",
	baseQuery: fetchBaseQuery({
		baseUrl: `${BASE_URL}/api`,
		prepareHeaders: (headers, { getState }) => {
			const token = (getState() as RootState).auth.token;
			if (token) {
				headers.set("Authorization", `Bearer ${token}`);
			}
			return headers;
		},
	}),
	tagTypes: ["Chat", "Message"],
	endpoints: (builder) => ({
		// Auth endpoints
		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
		}),

		// Chat endpoints
		createChat: builder.mutation<Chat, CreateChatRequest>({
			query: (body) => ({
				url: "/chats",
				method: "POST",
				body,
			}),
			invalidatesTags: ["Chat"],
		}),

		updateChat: builder.mutation<
			Chat,
			{ chatId: string; data: UpdateChatRequest }
		>({
			query: ({ chatId, data }) => ({
				url: `/chats/${chatId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { chatId }) => [
				{ type: "Chat", id: chatId },
			],
		}),

		deleteChat: builder.mutation<void, string>({
			query: (chatId) => ({
				url: `/chats/${chatId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, chatId) => [
				{ type: "Chat", id: chatId },
			],
		}),

		// Message endpoints
		createMessage: builder.mutation<
			Message,
			{ chatId: string; data: CreateMessageRequest }
		>({
			query: ({ chatId, data }) => ({
				url: `/chats/${chatId}/messages`,
				method: "POST",
				body: data,
			}),
			invalidatesTags: (_result, _error, { chatId }) => [
				{ type: "Message", id: chatId },
			],
		}),

		updateMessage: builder.mutation<
			Message,
			{ messageId: string; data: UpdateMessageRequest }
		>({
			query: ({ messageId, data }) => ({
				url: `/messages/${messageId}`,
				method: "PUT",
				body: data,
			}),
			invalidatesTags: (_result, _error, { messageId }) => [
				{ type: "Message", id: messageId },
			],
		}),

		deleteMessage: builder.mutation<void, string>({
			query: (messageId) => ({
				url: `/messages/${messageId}`,
				method: "DELETE",
			}),
			invalidatesTags: (_result, _error, messageId) => [
				{ type: "Message", id: messageId },
			],
		}),
	}),
});

export const {
	useLogoutMutation,
	useCreateChatMutation,
	useUpdateChatMutation,
	useDeleteChatMutation,
	useCreateMessageMutation,
	useUpdateMessageMutation,
	useDeleteMessageMutation,
} = apiService;
