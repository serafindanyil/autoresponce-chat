import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type {
	ChatPatchEvent,
	ChatState,
	ChatWithMessages,
	Message,
} from "@/shared/types";

const initialState: ChatState = {
	chats: {},
	messages: {},
	isConnected: false,
};

const chatSlice = createSlice({
	name: "chat",
	initialState,
	reducers: {
		setConnectionStatus: (state, action: PayloadAction<boolean>) => {
			state.isConnected = action.payload;
		},

		bootstrapChats: (state, action: PayloadAction<ChatWithMessages[]>) => {
			state.chats = {};
			state.messages = {};

			action.payload.forEach(({ chat, messages }) => {
				state.chats[chat._id] = chat;
				state.messages[chat._id] = messages;
			});
		},

		applyPatch: (state, action: PayloadAction<ChatPatchEvent>) => {
			const { chatId, chat, messages, removed } = action.payload;

			if (removed) {
				delete state.chats[chatId];
				delete state.messages[chatId];
				return;
			}

			if (chat) {
				state.chats[chatId] = chat;
			}

			if (messages) {
				state.messages[chatId] = messages;
			}
		},

		removeMessage: (
			state,
			action: PayloadAction<{ chatId: string; messageId: string }>
		) => {
			const { chatId, messageId } = action.payload;
			const chatMessages = state.messages[chatId];

			if (chatMessages) {
				state.messages[chatId] = chatMessages.filter(
					(msg) => msg._id !== messageId
				);
			}
		},

		updateMessage: (state, action: PayloadAction<Message>) => {
			const message = action.payload;
			const chatMessages = state.messages[message.chatId];

			if (chatMessages) {
				const index = chatMessages.findIndex((msg) => msg._id === message._id);
				if (index !== -1) {
					chatMessages[index] = message;
				} else {
					chatMessages.push(message);
				}
			}
		},

		clearChats: (state) => {
			state.chats = {};
			state.messages = {};
			state.isConnected = false;
		},
	},
});

export const {
	setConnectionStatus,
	bootstrapChats,
	applyPatch,
	removeMessage,
	updateMessage,
	clearChats,
} = chatSlice.actions;

export default chatSlice.reducer;
