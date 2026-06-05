import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ISocialLinks {
  telegram?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
}

export interface IHomepageContent extends Document {
  heroTitle: string;
  heroSubtitle: string;
  heroBgImage: string;
  aboutTitle: string;
  aboutText: string;
  aboutImage: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  socialLinks: ISocialLinks;
  updatedAt: Date;
}

const HomepageContentSchema: Schema<IHomepageContent> = new Schema(
  {
    heroTitle: {
      type: String,
      required: [true, 'Hero title is required'],
      trim: true,
    },
    heroSubtitle: {
      type: String,
      required: [true, 'Hero subtitle is required'],
      trim: true,
    },
    heroBgImage: {
      type: String,
      required: [true, 'Hero background image URL is required'],
      trim: true,
    },
    aboutTitle: {
      type: String,
      required: [true, 'About title is required'],
      trim: true,
    },
    aboutText: {
      type: String,
      required: [true, 'About text is required'],
      trim: true,
    },
    aboutImage: {
      type: String,
      required: [true, 'About image URL is required'],
      trim: true,
    },
    contactEmail: {
      type: String,
      required: [true, 'Contact email is required'],
      trim: true,
    },
    contactPhone: {
      type: String,
      required: [true, 'Contact phone is required'],
      trim: true,
    },
    contactAddress: {
      type: String,
      required: [true, 'Contact address is required'],
      trim: true,
    },
    socialLinks: {
      telegram: { type: String, default: '', trim: true },
      facebook: { type: String, default: '', trim: true },
      instagram: { type: String, default: '', trim: true },
      twitter: { type: String, default: '', trim: true },
    },
  },
  {
    timestamps: { createdAt: false, updatedAt: true },
  }
);

export const HomepageContent: Model<IHomepageContent> =
  mongoose.models.HomepageContent ||
  mongoose.model<IHomepageContent>('HomepageContent', HomepageContentSchema);

export default HomepageContent;
