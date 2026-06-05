import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/db';
import Rating from '@/models/Rating';
import Artwork from '@/models/Artwork';

// POST submit a rating (public)
export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const { productId, stars, visitorName } = body;

    // Validation
    if (!productId || stars === undefined || !visitorName) {
      return NextResponse.json(
        { error: 'productId, stars, and visitorName are required fields' },
        { status: 400 }
      );
    }

    const starCount = Number(stars);
    if (isNaN(starCount) || starCount < 1 || starCount > 5) {
      return NextResponse.json(
        { error: 'stars must be a number between 1 and 5' },
        { status: 400 }
      );
    }

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { error: 'Invalid productId format' },
        { status: 400 }
      );
    }

    // Verify artwork exists
    const artwork = await Artwork.findById(productId);
    if (!artwork) {
      return NextResponse.json(
        { error: 'Artwork not found' },
        { status: 404 }
      );
    }

    // Create the rating record
    const newRating = await Rating.create({
      productId: new mongoose.Types.ObjectId(productId),
      stars: starCount,
      visitorName: visitorName.trim(),
    });

    // Recalculate averageRating and totalRatings for the artwork
    const ratings = await Rating.find({ productId: new mongoose.Types.ObjectId(productId) });
    const totalRatings = ratings.length;
    const sumStars = ratings.reduce((sum, rating) => sum + rating.stars, 0);
    const averageRating = totalRatings > 0 ? Number((sumStars / totalRatings).toFixed(2)) : 5;

    // Update artwork ratings cache
    artwork.totalRatings = totalRatings;
    artwork.averageRating = averageRating;
    await artwork.save();

    return NextResponse.json({
      success: true,
      message: 'Rating submitted successfully',
      rating: newRating,
      artworkStats: {
        totalRatings,
        averageRating,
      },
    }, { status: 201 });
  } catch (error: any) {
    console.error('Error submitting rating:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
