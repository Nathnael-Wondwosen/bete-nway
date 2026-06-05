import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IArtistLinks {
  telegram?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface IArtist extends Document {
  fullName: string;
  biography: string;
  photo: string;
  socialLinks: IArtistLinks;
  createdAt: Date;
}

const ArtistSchema: Schema<IArtist> = new Schema(
  {
    fullName: {
      type: String,
      required: [true, 'Artist full name is required'],
      trim: true,
    },
    biography: {
      type: String,
      required: [true, 'Biography is required'],
      trim: true,
    },
    photo: {
      type: String,
      required: [true, 'Photo URL is required'],
      trim: true,
    },
    socialLinks: {
      telegram: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  }
);

export const Artist: Model<IArtist> =
  mongoose.models.Artist || mongoose.model<IArtist>('Artist', ArtistSchema);

export default Artist;
