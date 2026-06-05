import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';
import { getAdminFromToken } from '@/lib/jwt';

// PUT update collection (admin only)
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
    const { name, slug, description, featuredImage } = body;

    const collection = await Collection.findById(id);
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    if (name) collection.name = name.trim();
    if (slug) {
      collection.slug = slug.toLowerCase().trim().replace(/\s+/g, '-');
    } else if (name) {
      collection.slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) collection.description = description;
    if (featuredImage !== undefined) collection.featuredImage = featuredImage;

    await collection.save();

    return NextResponse.json({ success: true, collection });
  } catch (error: any) {
    console.error('Error updating collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE collection (admin only)
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

    const collection = await Collection.findByIdAndDelete(id);
    if (!collection) {
      return NextResponse.json(
        { error: 'Collection not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Collection deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
