import { Schema, model, type Document, type Model, Types } from "mongoose";

export interface ChatMetadata {
	readonly avatarUrl?: string;
}

export interface Chat {
	readonly firstName: string;
	readonly lastName: string;
	readonly metadata?: ChatMetadata;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface ChatDocument extends Chat, Document<Types.ObjectId> {}
export type ChatLean = Chat & { readonly _id: Types.ObjectId };

const chatSchema = new Schema<ChatDocument>(
	{
		firstName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		lastName: {
			type: String,
			required: true,
			trim: true,
			maxlength: 100,
		},
		metadata: {
			avatarUrl: {
				type: String,
				trim: true,
			},
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

chatSchema.index({ updatedAt: -1 });
chatSchema.index({ firstName: "text", lastName: "text" });

export const ChatModel: Model<ChatDocument> = model<ChatDocument>(
	"Chat",
	chatSchema
);
