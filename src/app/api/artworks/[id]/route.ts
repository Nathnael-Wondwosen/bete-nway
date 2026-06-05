import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Artwork from '@/models/Artwork';
import Category from '@/models/Category';
import Artist from '@/models/Artist';
import Collection from '@/models/Collection';
import { getAdminFromToken } from '@/lib/jwt';

// GET a single artwork by ID or slug
export async function GET(
  request: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    await dbConnect();

    let artwork;
    if (mongoose.Types.ObjectId.isValid(id)) {
      artwork = await Artwork.findById(id)
        .populate('categoryId')
        .populate('artistId')
        .populate('collections');
    } else {
      artwork = await Artwork.findOne({ slug: id.toLowerCase().trim() })
        .populate('categoryId')
        .populate('artistId')
        .populate('collections');
    }

    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // If it's archived/not active, check if requester is admin
    if (artwork.status !== 'active') {
      const admin = await getAdminFromToken();
      if (!admin) {
        return NextResponse.json(
          { error: 'Artwork is archived or unavailable' },
          { status: 403 }
        );
      }
    }

    return NextResponse.json({ success: true, artwork });
  } catch (error: any) {
    console.error('Error fetching artwork:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT update artwork (admin only)
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

    const {
      title,
      slug,
      description,
      story,
      categoryId,
      collections,
      artistId,
      price,
      dimensions,
      materials,
      images,
      featuredImage,
      featured,
      status,
    } = body;

    const artwork = await Artwork.findById(id);
    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Apply updates if present
    if (title !== undefined) artwork.title = title.trim();
    if (slug !== undefined) {
      artwork.slug = slug.toLowerCase().trim().replace(/\s+/g, '-');
    } else if (title !== undefined) {
      artwork.slug = title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    }
    if (description !== undefined) artwork.description = description.trim();
    if (story !== undefined) artwork.story = story;
    if (price !== undefined) artwork.price = Number(price);
    if (dimensions !== undefined) artwork.dimensions = dimensions.trim();
    if (materials !== undefined) artwork.materials = materials.trim();
    if (images !== undefined) {
      artwork.images = Array.isArray(images) ? images : [images];
    }
    if (featuredImage !== undefined) artwork.featuredImage = featuredImage.trim();
    if (featured !== undefined) artwork.featured = !!featured;
    if (status !== undefined) artwork.status = status;

    // Validate and update categoryId if provided
    if (categoryId) {
      const categoryExists = await Category.findById(categoryId);
      if (!categoryExists) {
        return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 });
      }
      artwork.categoryId = new mongoose.Types.ObjectId(categoryId);
    }

    // Validate and update artistId if provided
    if (artistId) {
      const artistExists = await Artist.findById(artistId);
      if (!artistExists) {
        return NextResponse.json({ error: 'Invalid artistId' }, { status: 400 });
      }
      artwork.artistId = new mongoose.Types.ObjectId(artistId);
    }

    // Validate and update collections if provided
    if (collections && Array.isArray(collections)) {
      let collectionIds: string[] = [];
      for (const colId of collections) {
        if (mongoose.Types.ObjectId.isValid(colId)) {
          const colExists = await Collection.findById(colId);
          if (colExists) {
            collectionIds.push(colId);
          }
        }
      }
      artwork.collections = collectionIds.map((id) => new mongoose.Types.ObjectId(id));
    }

    await artwork.save();

    return NextResponse.json({ success: true, artwork });
  } catch (error: any) {
    console.error('Error updating artwork:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE artwork (admin only)
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

    const artwork = await Artwork.findByIdAndDelete(id);
    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Artwork deleted successfully',
    });
  } catch (error: any) {
    console.error('Error deleting artwork:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
