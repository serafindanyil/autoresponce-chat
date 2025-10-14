import { Schema, model, type Document, type Model, Types } from "mongoose";

export interface ChatMetadata {
	readonly avatarUrl?: string;
}

export interface Chat {
	readonly ownerId: Types.ObjectId;
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
		ownerId: {
			type: Schema.Types.ObjectId,
			ref: "User",
			required: true,
			index: true,
		},
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

chatSchema.index({ ownerId: 1, updatedAt: -1 });
chatSchema.index({ ownerId: 1, firstName: "text", lastName: "text" });

export const ChatModel: Model<ChatDocument> = model<ChatDocument>(
	"Chat",
	chatSchema
);
