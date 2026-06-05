import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ICollection extends Document {
  name: string;
  slug: string;
  description?: string;
  featuredImage?: string;
}

const CollectionSchema: Schema<ICollection> = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Collection name is required'],
      trim: true,
    },
    slug: {
      type: String,
      required: [true, 'Slug is required'],
      unique: true,
      trim: true,
      lowercase: true,
    },
    description: {
      type: String,
      trim: true,
    },
    featuredImage: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

export const Collection: Model<ICollection> =
  mongoose.models.Collection || mongoose.model<ICollection>('Collection', CollectionSchema);

export default Collection;
