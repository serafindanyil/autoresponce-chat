import { Schema, model, type Document, type Model } from "mongoose";

export interface User {
	readonly email: string;
	readonly name: string;
	readonly createdAt: Date;
	readonly updatedAt: Date;
}

export interface UserDocument extends User, Document {}

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
		},
	},
	{
		timestamps: true,
		versionKey: false,
	}
);

export const UserModel: Model<UserDocument> = model<UserDocument>(
	"User",
	userSchema
);
