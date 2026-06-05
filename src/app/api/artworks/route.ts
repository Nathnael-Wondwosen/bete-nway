import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Artwork from '@/models/Artwork';
import Category from '@/models/Category';
import Artist from '@/models/Artist';
import Collection from '@/models/Collection';
import { getAdminFromToken } from '@/lib/jwt';

// GET artworks with filters
export async function GET(request: Request) {
  try {
    await dbConnect();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get('category');
    const artist = searchParams.get('artist');
    const collection = searchParams.get('collection');
    const search = searchParams.get('search');
    const sort = searchParams.get('sort');
    const statusParam = searchParams.get('status');

    // Admin check for viewing inactive/all artworks
    const admin = await getAdminFromToken();
    const query: any = {};

    // 1. Status Filter: force 'active' for public, let admin choose or show all
    if (admin) {
      if (statusParam) {
        query.status = statusParam;
      }
    } else {
      query.status = 'active';
    }

    // 2. Category Filter (supports ID or slug)
    if (category) {
      if (mongoose.Types.ObjectId.isValid(category)) {
        query.categoryId = new mongoose.Types.ObjectId(category);
      } else {
        const cat = await Category.findOne({ slug: category.toLowerCase().trim() });
        if (cat) {
          query.categoryId = cat._id;
        } else {
          // No category found matching the slug, force return empty
          return NextResponse.json({ success: true, artworks: [] });
        }
      }
    }

    // 3. Artist Filter (supports ID or fullName match)
    if (artist) {
      if (mongoose.Types.ObjectId.isValid(artist)) {
        query.artistId = new mongoose.Types.ObjectId(artist);
      } else {
        const art = await Artist.findOne({
          fullName: { $regex: new RegExp(artist.trim(), 'i') },
        });
        if (art) {
          query.artistId = art._id;
        } else {
          return NextResponse.json({ success: true, artworks: [] });
        }
      }
    }

    // 4. Collection Filter (supports ID or slug)
    if (collection) {
      if (mongoose.Types.ObjectId.isValid(collection)) {
        query.collections = new mongoose.Types.ObjectId(collection);
      } else {
        const coll = await Collection.findOne({ slug: collection.toLowerCase().trim() });
        if (coll) {
          query.collections = coll._id;
        } else {
          return NextResponse.json({ success: true, artworks: [] });
        }
      }
    }

    // 5. Search Filter
    if (search) {
      const searchRegex = new RegExp(search.trim(), 'i');
      query.$or = [
        { title: { $regex: searchRegex } },
        { description: { $regex: searchRegex } },
        { story: { $regex: searchRegex } },
        { materials: { $regex: searchRegex } },
      ];
    }

    // 6. Sorting Setup
    let sortObj: any = { createdAt: -1 }; // Default: newest first
    if (sort === 'featured') {
      sortObj = { featured: -1, createdAt: -1 };
    } else if (sort === 'price-asc') {
      sortObj = { price: 1 };
    } else if (sort === 'price-desc') {
      sortObj = { price: -1 };
    } else if (sort === 'rating') {
      sortObj = { averageRating: -1, totalRatings: -1 };
    } else if (sort === 'oldest') {
      sortObj = { createdAt: 1 };
    }

    const artworks = await Artwork.find(query)
      .populate('categoryId')
      .populate('artistId')
      .populate('collections')
      .sort(sortObj);

    return NextResponse.json({ success: true, count: artworks.length, artworks });
  } catch (error: any) {
    console.error('Error fetching artworks:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST create a new artwork (admin only)
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

    // Check required fields
    if (
      !title ||
      !description ||
      !categoryId ||
      !artistId ||
      price === undefined ||
      !dimensions ||
      !materials ||
      !images ||
      !featuredImage
    ) {
      return NextResponse.json(
        { error: 'Missing required artwork fields' },
        { status: 400 }
      );
    }

    // Generate slug if not provided
    const artworkSlug = slug
      ? slug.toLowerCase().trim().replace(/\s+/g, '-')
      : title.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');

    const existingArtwork = await Artwork.findOne({ slug: artworkSlug });
    if (existingArtwork) {
      return NextResponse.json(
        { error: 'Artwork with this slug or title already exists' },
        { status: 400 }
      );
    }

    // Verify category exists
    const categoryExists = await Category.findById(categoryId);
    if (!categoryExists) {
      return NextResponse.json({ error: 'Invalid categoryId' }, { status: 400 });
    }

    // Verify artist exists
    const artistExists = await Artist.findById(artistId);
    if (!artistExists) {
      return NextResponse.json({ error: 'Invalid artistId' }, { status: 400 });
    }

    // Verify collections if provided
    let collectionIds: string[] = [];
    if (collections && Array.isArray(collections)) {
      for (const colId of collections) {
        if (mongoose.Types.ObjectId.isValid(colId)) {
          const colExists = await Collection.findById(colId);
          if (colExists) {
            collectionIds.push(colId);
          }
        }
      }
    }

    const newArtwork = await Artwork.create({
      title: title.trim(),
      slug: artworkSlug,
      description: description.trim(),
      story: story || '',
      categoryId: new mongoose.Types.ObjectId(categoryId),
      artistId: new mongoose.Types.ObjectId(artistId),
      collections: collectionIds.map((id) => new mongoose.Types.ObjectId(id)),
      price: Number(price),
      dimensions: dimensions.trim(),
      materials: materials.trim(),
      images: Array.isArray(images) ? images : [images],
      featuredImage: featuredImage.trim(),
      featured: !!featured,
      status: status || 'active',
    });

    return NextResponse.json({ success: true, artwork: newArtwork }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating artwork:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
