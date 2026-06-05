import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Artist from '@/models/Artist';
import { getAdminFromToken } from '@/lib/jwt';

// PUT update artist (admin only)
export async function PUT(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await dbConnect();
    const body = await request.json();
    const { fullName, biography, photo, socialLinks } = body;

    const artist = await Artist.findById(id);
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    if (fullName) artist.fullName = fullName.trim();
    if (biography) artist.biography = biography.trim();
    if (photo) artist.photo = photo.trim();
    if (socialLinks) {
      artist.socialLinks = {
        telegram: socialLinks.telegram !== undefined ? socialLinks.telegram : artist.socialLinks.telegram,
        facebook: socialLinks.facebook !== undefined ? socialLinks.facebook : artist.socialLinks.facebook,
        instagram: socialLinks.instagram !== undefined ? socialLinks.instagram : artist.socialLinks.instagram,
        twitter: socialLinks.twitter !== undefined ? socialLinks.twitter : artist.socialLinks.twitter,
      };
    }

    await artist.save();

    return NextResponse.json({ success: true, artist });
  } catch (error: any) {
    console.error('Error updating artist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE artist (admin only)
export async function DELETE(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const admin = await getAdminFromToken();
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized: Admin access required' },
        { status: 401 }
      );
    }

    const { id } = await context.params;
    await dbConnect();

    const artist = await Artist.findByIdAndDelete(id);
    if (!artist) {
      return NextResponse.json(
        { error: 'Artist not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Artist deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting artist:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
