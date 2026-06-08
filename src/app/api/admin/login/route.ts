import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import dbConnect from '@/lib/db';
import Admin from '@/models/Admin';
import { signJWT, setAdminCookie } from '@/lib/jwt';

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const admin = await Admin.findOne({ email: email.toLowerCase().trim() });
    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, admin.passwordHash);
    if (!isMatch) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    const token = await signJWT({
      id: admin._id.toString(),
      email: admin.email,
      role: admin.role,
    });

    await setAdminCookie(token);

    return NextResponse.json({
      success: true,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (error: any) {
    console.error('Login error:', error);

    // Surface database connection issues to the user
    const isDbError =
      error?.name === 'MongoNetworkError' ||
      error?.name === 'MongooseServerSelectionError' ||
      error?.message?.includes('ECONNREFUSED') ||
      error?.message?.includes('querySrv') ||
      error?.message?.includes('connect');

    if (isDbError) {
      return NextResponse.json(
        { error: 'Database connection failed. Please check that your MongoDB Atlas cluster is running and the connection string is correct.' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
