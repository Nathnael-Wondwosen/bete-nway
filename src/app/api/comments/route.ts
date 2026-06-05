import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Comment from '@/models/Comment';
import Artwork from '@/models/Artwork';
import { getAdminFromToken } from '@/lib/jwt';

// GET comments for an artwork
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId') || searchParams.get('artworkId');

    await dbConnect();

    // Check if requester is admin
    const admin = await getAdminFromToken();
    const query: any = {};

    if (productId) {
      if (!mongoose.Types.ObjectId.isValid(productId)) {
        return NextResponse.json(
          { error: 'Invalid productId format' },
          { status: 400 }
        );
      }
      query.productId = new mongoose.Types.ObjectId(productId);
    } else if (!admin) {
      return NextResponse.json(
        { error: 'productId or artworkId query parameter is required' },
        { status: 400 }
      );
    }

    if (!admin) {
      // Public users only see approved comments
      query.approved = true;
    }

    // Populate the artwork information (title and featuredImage)
    const comments = await Comment.find(query)
      .populate('productId', 'title featuredImage')
      .sort({ createdAt: -1 });

    return NextResponse.json({ success: true, count: comments.length, comments });
  } catch (error: any) {
    console.error('Error fetching comments:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST submit a comment (public)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, name, email, comment } = body;

    if (!productId || !name || !email || !comment) {
      return NextResponse.json(
        { error: 'productId, name, email, and comment are required fields' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid productId format' },
        { status: 400 }
      );
    }

    // Verify target artwork exists
    const artworkExists = await Artwork.findById(productId);
    if (!artworkExists) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    const newComment = await Comment.create({
      productId: new mongoose.Types.ObjectId(productId),
      name: name.trim(),
      email: email.toLowerCase().trim(),
      comment: comment.trim(),
      approved: false, // Moderated by default
    });

    return NextResponse.json({
      success: true,
      message: 'Comment submitted successfully. It will appear once approved by an administrator.',
      comment: newComment,
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating comment:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
