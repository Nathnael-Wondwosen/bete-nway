import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Artist from '@/models/Artist';
import { getAdminFromToken } from '@/lib/jwt';

// GET all artists
export async function GET() {
  try {
    await dbConnect();
    const artists = await Artist.find({}).sort({ fullName: 1 });
    return NextResponse.json({ success: true, artists });
  } catch (error: any) {
    console.error('Error fetching artists:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new artist (admin only)
export async function POST(request: Request) {
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
    const { fullName, biography, photo, socialLinks } = body;

    if (!fullName || !biography || !photo) {
      return NextResponse.json(
        { error: 'fullName, biography, and photo are required fields' },
        { status: 400 }
      );
    }

    const newArtist = await Artist.create({
      fullName: fullName.trim(),
      biography: biography.trim(),
      photo: photo.trim(),
      socialLinks: {
        telegram: socialLinks?.telegram || '',
        facebook: socialLinks?.facebook || '',
        instagram: socialLinks?.instagram || '',
        twitter: socialLinks?.twitter || '',
      },
    });

    return NextResponse.json({ success: true, artist: newArtist }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating artist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
