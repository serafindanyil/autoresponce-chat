import { Schema, model, type Document, type Model, Types } from "mongoose";

export interface MessageAuthor {
  readonly userId?: Types.ObjectId;
  readonly name: string;
  readonly isBot: boolean;
}

export interface Message {
  readonly chatId: Types.ObjectId;
  readonly author: MessageAuthor;
  readonly text: string;
  readonly createdAt: Date;
  readonly updatedAt: Date;
}

export interface MessageDocument extends Message, Document<Types.ObjectId> {}
export type MessageLean = Message & { readonly _id: Types.ObjectId };

const messageAuthorSchema = new Schema<MessageAuthor>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 120,
    },
    isBot: {
      type: Boolean,
      default: true,
    },
  },
  { _id: false },
);

const messageSchema = new Schema<MessageDocument>(
  {
    chatId: {
      type: Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
      index: true,
    },
    author: {
      type: messageAuthorSchema,
      required: true,
    },
    text: {
      type: String,
      required: true,
      trim: true,
      maxlength: 2000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

messageSchema.index({ chatId: 1, createdAt: 1 });

export const MessageModel: Model<MessageDocument> = model<MessageDocument>(
  "Message",
  messageSchema,
);
