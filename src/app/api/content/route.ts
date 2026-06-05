import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import HomepageContent from '@/models/HomepageContent';
import { getAdminFromToken } from '@/lib/jwt';

// Default content used if database hasn't been seeded yet
const DEFAULT_HOMEPAGE_CONTENT = {
  heroTitle: 'Orthodox Orthodox Art Expo',
  heroSubtitle: 'Explore the divine stories and rich traditions preserved through traditional sacred art.',
  heroBgImage: 'https://images.unsplash.com/photo-1548625361-155deee223d2?auto=format&fit=crop&q=80',
  aboutTitle: 'About Bete Nway',
  aboutText: 'Bete Nway is dedicated to preserving, celebrating, and sharing the exquisite beauty of Ethiopian Orthodox art and iconography. Our platform connects modern collectors, believers, and art enthusiasts with rich narratives of ancient Christian artwork.',
  aboutImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
  contactEmail: 'info@orthodoxart.expo',
  contactPhone: '+251911000000',
  contactAddress: 'Addis Ababa, Ethiopia',
  socialLinks: {
    telegram: 'https://t.me/orthodoxartexpo',
    facebook: 'https://facebook.com/orthodoxartexpo',
    instagram: 'https://instagram.com/orthodoxartexpo',
    twitter: 'https://twitter.com/orthodoxartexpo',
  },
};

// GET homepage content (public)
export async function GET() {
  try {
    await dbConnect();
    let content = await HomepageContent.findOne();
    if (!content) {
      // Return defaults instead of 404 to make development/first run smoother
      return NextResponse.json({ success: true, content: DEFAULT_HOMEPAGE_CONTENT, isDefault: true });
    }
    return NextResponse.json({ success: true, content });
  } catch (error: any) {
    console.error('Error fetching homepage content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update homepage content (admin only)
export async function PUT(request: Request) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    await dbConnect();
    const body = await request.json();

    // Find first document and update, or create if none exists
    const updatedContent = await HomepageContent.findOneAndUpdate(
      {},
      {
        heroTitle: body.heroTitle,
        heroSubtitle: body.heroSubtitle,
        heroBgImage: body.heroBgImage,
        aboutTitle: body.aboutTitle,
        aboutText: body.aboutText,
        aboutImage: body.aboutImage,
        contactEmail: body.contactEmail,
        contactPhone: body.contactPhone,
        contactAddress: body.contactAddress,
        socialLinks: {
          telegram: body.socialLinks?.telegram || '',
          facebook: body.socialLinks?.facebook || '',
          instagram: body.socialLinks?.instagram || '',
          twitter: body.socialLinks?.twitter || '',
        },
      },
      {
        new: true,
        upsert: true,
        runValidators: true,
      }
    );

    return NextResponse.json({ success: true, content: updatedContent });
  } catch (error: any) {
    console.error('Error updating homepage content:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
