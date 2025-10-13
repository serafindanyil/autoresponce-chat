import { Schema, model, type Document, type Model, Types } from "mongoose";

export type OAuthProvider = "google" | "facebook";

export interface User {
	readonly email: string;
	readonly name: string;
	readonly provider: OAuthProvider;
	readonly providerId: string;
	readonly avatarUrl?: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface UserDocument extends User, Document<Types.ObjectId> {}
export type UserLean = User & { readonly _id: Types.ObjectId };

const userSchema = new Schema<UserDocument>(
	{
		email: {
			type: String,
			required: true,
			unique: true,
			trim: true,
			lowercase: true,
		},
		name: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},
		provider: {
			type: String,
			enum: ["google"],
			required: true,
		},
		providerId: {
			type: String,
			required: true,
			index: true,
		},
		avatarUrl: {
			type: String,
			trim: true,
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

userSchema.index({ email: 1, provider: 1 }, { unique: true });

export const UserModel: Model<UserDocument> = model<UserDocument>(
	"User",
	userSchema
);
