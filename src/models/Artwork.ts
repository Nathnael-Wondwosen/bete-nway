import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArtwork extends Document {
  title: string;
  slug: string;
  description: string;
  story?: string;
  categoryId: mongoose.Types.ObjectId;
  collections: mongoose.Types.ObjectId[];
  artistId: mongoose.Types.ObjectId;
  price: number;
  dimensions: string;
  materials: string;
  images: string[];
  featuredImage: string;
  averageRating: number;
  totalRatings: number;
  featured: boolean;
  status: string; // e.g. 'active', 'archived'
  createdAt: Date;
  updatedAt: Date;
}

const ArtworkSchema: Schema<IArtwork> = new Schema(
  {
    title: {
      type: String,
      required: [true, 'Artwork title is required'],
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
      required: [true, 'Description is required'],
      trim: true,
    },
    story: {
      type: String,
      trim: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'Category ID is required'],
    },
    collections: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Collection',
      },
    ],
    artistId: {
      type: Schema.Types.ObjectId,
      ref: 'Artist',
      required: [true, 'Artist ID is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    dimensions: {
      type: String,
      required: [true, 'Dimensions are required'],
      trim: true,
    },
    materials: {
      type: String,
      required: [true, 'Materials are required'],
      trim: true,
    },
    images: {
      type: [String],
      required: [true, 'At least one artwork image URL is required'],
      validate: {
        validator: function (v: string[]) {
          return Array.isArray(v) && v.length > 0;
        },
        message: 'Artwork must have at least one image url',
      },
    },
    featuredImage: {
      type: String,
      required: [true, 'Featured image is required'],
      trim: true,
    },
    averageRating: {
      type: Number,
      default: 5,
      min: [0, 'Rating cannot be less than 0'],
      max: [5, 'Rating cannot be more than 5'],
    },
    totalRatings: {
      type: Number,
      default: 0,
      min: [0, 'Total ratings cannot be negative'],
    },
    featured: {
      type: Boolean,
      default: false,
    },
    status: {
      type: String,
      enum: ['active', 'archived'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

export const Artwork: Model<IArtwork> =
  mongoose.models.Artwork || mongoose.model<IArtwork>('Artwork', ArtworkSchema);

export default Artwork;
