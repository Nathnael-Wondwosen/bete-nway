import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IRating extends Document {
  productId: mongoose.Types.ObjectId;
  stars: number;
  visitorName: string;
  createdAt: Date;
}

const RatingSchema: Schema<IRating> = new Schema(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: 'Artwork',
      required: [true, 'Artwork ID (productId) is required'],
    },
    stars: {
      type: Number,
      required: [true, 'Number of stars is required'],
      min: [1, 'Rating must be at least 1 star'],
      max: [5, 'Rating cannot exceed 5 stars'],
    },
    visitorName: {
      type: String,
      required: [true, 'Visitor name is required'],
      trim: true,
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

export const Rating: Model<IRating> =
  mongoose.models.Rating || mongoose.model<IRating>('Rating', RatingSchema);

export default Rating;
