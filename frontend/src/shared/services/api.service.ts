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

// Custom baseQuery that handles 204 No Content responses
const baseQueryWithNoContentHandler = fetchBaseQuery({
	baseUrl: `${BASE_URL}/api`,
	prepareHeaders: (headers, { getState }) => {
		const token = (getState() as RootState).auth.token;
		if (token) {
			headers.set("Authorization", `Bearer ${token}`);
		}
		return headers;
	},
});

export const apiService = createApi({
	reducerPath: "api",
	baseQuery: async (args, api, extraOptions) => {
		const result = await baseQueryWithNoContentHandler(args, api, extraOptions);

		// Handle 204 No Content - повертаємо null як успішний результат
		if (result.meta?.response?.status === 204) {
			return { data: null };
		}

		// Handle 201 Created without body
		if (result.meta?.response?.status === 201 && !result.data) {
			return { data: null };
		}

		return result;
	},
	// No tagTypes needed - all data comes from Socket.IO
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
			// No invalidatesTags - data comes via Socket.IO
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
			// No invalidatesTags - data comes via Socket.IO
		}),

		deleteChat: builder.mutation<void, string>({
			query: (chatId) => ({
				url: `/chats/${chatId}`,
				method: "DELETE",
			}),
			// No invalidatesTags - data comes via Socket.IO
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
			// No invalidatesTags - data comes via Socket.IO
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
			// No invalidatesTags - data comes via Socket.IO
		}),

		deleteMessage: builder.mutation<void, string>({
			query: (messageId) => ({
				url: `/messages/${messageId}`,
				method: "DELETE",
			}),
			// No invalidatesTags - data comes via Socket.IO
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
