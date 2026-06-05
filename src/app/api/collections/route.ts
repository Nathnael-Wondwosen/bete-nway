import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import Collection from '@/models/Collection';
import { getAdminFromToken } from '@/lib/jwt';

// GET all collections
export async function GET() {
  try {
    await dbConnect();
    const collections = await Collection.find({}).sort({ name: 1 });
    return NextResponse.json({ success: true, collections });
  } catch (error: any) {
    console.error('Error fetching collections:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new collection (admin only)
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
    const { name, slug, description, featuredImage } = body;

    if (!name) {
      return NextResponse.json(
        { error: 'Collection name is required' },
        { status: 400 }
      );
    }

    // Generate slug from name if not provided
    const collectionSlug = slug
      ? slug.toLowerCase().trim().replace(/\s+/g, '-')
      : name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingCollection = await Collection.findOne({ slug: collectionSlug });
    if (existingCollection) {
      return NextResponse.json(
        { error: 'Collection with this slug already exists' },
        { status: 400 }
      );
    }

    const newCollection = await Collection.create({
      name: name.trim(),
      slug: collectionSlug,
      description: description || '',
      featuredImage: featuredImage || '',
    });

    return NextResponse.json({ success: true, collection: newCollection }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating collection:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
