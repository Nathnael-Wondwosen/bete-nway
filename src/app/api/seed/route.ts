import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import Category from '@/models/Category';
import Collection from '@/models/Collection';
import Artist from '@/models/Artist';
import Artwork from '@/models/Artwork';
import HomepageContent from '@/models/HomepageContent';

export async function POST() {
  try {
    await dbConnect();
    const results: any = {};

    // 1. Seed Admin if none exists
    const adminCount = await Admin.countDocuments();
    if (adminCount === 0) {
      const defaultEmail = process.env.ADMIN_EMAIL || 'admin@orthodoxart.expo';
      const defaultPassword = process.env.ADMIN_PASSWORD || 'admin123';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      const newAdmin = await Admin.create({
        fullName: 'Platform Administrator',
        email: defaultEmail,
        passwordHash: hashedPassword,
        role: 'admin',
      });
      results.admin = {
        email: newAdmin.email,
        fullName: newAdmin.fullName,
        message: 'Default admin created successfully',
      };
    } else {
      results.admin = {
        message: `Admin seeding skipped: ${adminCount} admin(s) already exist`,
      };
    }

    // 2. Seed Categories if none exist
    let categories = await Category.find();
    if (categories.length === 0) {
      const sampleCategories = [
        {
          name: 'Icons',
          slug: 'icons',
          description: 'Sacred paintings of religious figures and biblical events.',
          icon: 'Paintbrush',
        },
        {
          name: 'Manuscripts',
          slug: 'manuscripts',
          description: 'Ancient illuminated hand-written parchments and Ge’ez scriptures.',
          icon: 'BookOpen',
        },
        {
          name: 'Crosses',
          slug: 'crosses',
          description: 'Processional, hand, and neck crosses made of brass, silver, and wood.',
          icon: 'Feather',
        },
        {
          name: 'Tapestries',
          slug: 'tapestries',
          description: 'Traditional woven sacred fabrics and embroidered wall hangings.',
          icon: 'Layers',
        },
      ];
      categories = await Category.insertMany(sampleCategories);
      results.categories = {
        count: categories.length,
        message: 'Sample categories seeded successfully',
      };
    } else {
      results.categories = {
        message: `Category seeding skipped: ${categories.length} categories already exist`,
      };
    }

    // 3. Seed Collections if none exist
    let collections = await Collection.find();
    if (collections.length === 0) {
      const sampleCollections = [
        {
          name: 'Lalibela Treasures',
          slug: 'lalibela-treasures',
          description: 'Artworks inspired by or sourced from the rock-hewn churches of Lalibela.',
          featuredImage: 'https://images.unsplash.com/photo-1548625361-155deee223d2?auto=format&fit=crop&q=80',
        },
        {
          name: 'Axumite Legacy',
          slug: 'axumite-legacy',
          description: 'Sacred objects and art reflecting the ancient kingdom of Axum.',
          featuredImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
        },
      ];
      collections = await Collection.insertMany(sampleCollections);
      results.collections = {
        count: collections.length,
        message: 'Sample collections seeded successfully',
      };
    } else {
      results.collections = {
        message: `Collection seeding skipped: ${collections.length} collections already exist`,
      };
    }

    // 4. Seed Artists if none exist
    let artists = await Artist.find();
    if (artists.length === 0) {
      const sampleArtists = [
        {
          fullName: 'Abba Mezgebe',
          biography: 'A monk and master iconographer from Gondar with 40 years of experience in traditional Byzantine and Ethiopian Orthodox art styles.',
          photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80',
          socialLinks: {
            telegram: 'https://t.me/abbamezgebe',
            facebook: 'https://facebook.com/abbamezgebe',
            instagram: '',
            twitter: '',
          },
        },
        {
          fullName: 'Selamawit Alene',
          biography: 'A contemporary Ethiopian artist specializing in blending traditional church manuscript/scroll designs with modern canvas techniques.',
          photo: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80',
          socialLinks: {
            telegram: '',
            facebook: '',
            instagram: 'https://instagram.com/selamawitalene',
            twitter: 'https://twitter.com/selamawitalene',
          },
        },
      ];
      artists = await Artist.insertMany(sampleArtists);
      results.artists = {
        count: artists.length,
        message: 'Sample artists seeded successfully',
      };
    } else {
      results.artists = {
        message: `Artist seeding skipped: ${artists.length} artists already exist`,
      };
    }

    // 5. Seed HomepageContent if none exists
    let homepageContent = await HomepageContent.findOne();
    if (!homepageContent) {
      homepageContent = await HomepageContent.create({
        heroTitle: 'Orthodox Art Expo',
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
      });
      results.homepageContent = {
        message: 'Default homepage content seeded successfully',
      };
    } else {
      results.homepageContent = {
        message: 'Homepage content seeding skipped: already exists',
      };
    }

    // 6. Seed Artworks if none exist
    const artworkCount = await Artwork.countDocuments();
    if (artworkCount === 0 && categories.length > 0 && artists.length > 0) {
      // Find IDs
      const iconsCat = categories.find((c) => c.slug === 'icons') || categories[0];
      const crossesCat = categories.find((c) => c.slug === 'crosses') || categories[0];

      const abbaMezgebe = artists.find((a) => a.fullName === 'Abba Mezgebe') || artists[0];
      const selamawit = artists.find((a) => a.fullName === 'Selamawit Alene') || artists[0];

      const lalibelaColl = collections.find((c) => c.slug === 'lalibela-treasures');
      const axumColl = collections.find((c) => c.slug === 'axumite-legacy');

      const sampleArtworks = [
        {
          title: 'St. George and the Dragon Icon',
          slug: 'st-george-and-the-dragon-icon',
          description: 'A beautiful hand-painted traditional wooden icon of St. George defeating the dragon, symbolizing the victory of faith over evil. Crafted with attention to detail and traditional color pigments.',
          story: 'St. George is one of the most prominent martyr saints in the Ethiopian Orthodox Church. According to custom, this design represents protection, courage, and spiritual warfare against dark forces.',
          categoryId: iconsCat._id,
          artistId: abbaMezgebe._id,
          collections: lalibelaColl ? [lalibelaColl._id] : [],
          price: 450,
          dimensions: '40 x 50 cm',
          materials: 'Olive wood, natural egg tempera, gold leaf',
          images: [
            'https://images.unsplash.com/photo-1548625361-155deee223d2?auto=format&fit=crop&q=80',
          ],
          featuredImage: 'https://images.unsplash.com/photo-1548625361-155deee223d2?auto=format&fit=crop&q=80',
          featured: true,
          status: 'active',
          averageRating: 5,
          totalRatings: 1,
        },
        {
          title: 'Processional Cross of Lalibela',
          slug: 'processional-cross-of-lalibela',
          description: 'An elegant, hand-crafted processional cross featuring classic Lalibela geometric design styles. Perfect for display or sacred liturgical use.',
          story: 'Ethiopian processional crosses feature intricate latticework and geometric loops. The absence of a representation of the crucified Christ emphasizes the resurrection, and the endless loops represent the eternity of God.',
          categoryId: crossesCat._id,
          artistId: selamawit._id,
          collections: axumColl ? [axumColl._id] : [],
          price: 650,
          dimensions: '30 x 15 cm',
          materials: 'Hand-cast brass, dark walnut stand',
          images: [
            'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
          ],
          featuredImage: 'https://images.unsplash.com/photo-1579783902614-a3fb3927b6a5?auto=format&fit=crop&q=80',
          featured: true,
          status: 'active',
          averageRating: 4.8,
          totalRatings: 4,
        },
      ];

      const createdArtworks = await Artwork.insertMany(sampleArtworks);
      results.artworks = {
        count: createdArtworks.length,
        message: 'Sample artworks seeded successfully',
      };
    } else {
      results.artworks = {
        message: `Artwork seeding skipped: ${artworkCount} artworks already exist`,
      };
    }

    return NextResponse.json({
      success: true,
      seeded: results,
    });
  } catch (error: any) {
    console.error('Error seeding database:', error);
    return NextResponse.json(
      { error: 'Internal server error during seeding', details: error.message },
      { status: 500 }
    );
  }
}
