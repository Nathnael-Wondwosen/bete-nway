import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IComment extends Document {
  productId: mongoose.Types.ObjectId;
  name: string;
  email: string;
  comment: string;
  approved: boolean;
  createdAt: Date;
}

const CommentSchema: Schema<IComment> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Artwork',
      required: [true, 'Artwork ID (productId) is required'],
    },
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      trim: true,
      lowercase: true,
    },
    comment: {
      type: String,
      required: [true, 'Comment content is required'],
      trim: true,
    },
    approved: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: false,
  }
);

export const Comment: Model<IComment> =
  mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
