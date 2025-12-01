import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

// Route segment config
export const runtime = 'nodejs';
export const maxDuration = 60;

// Note: Body size limits are handled by Vercel automatically for blob uploads
// Default limit is 4.5MB for Hobby plan, 50MB for Pro plan

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    console.log('File received:', { name: file.name, type: file.type, size: file.size });

    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      return NextResponse.json({ error: 'Invalid file type. Only images are allowed.' }, { status: 400 });
    }

    // Validate file size (4.5MB max for Vercel Hobby plan)
    const maxSize = 4.5 * 1024 * 1024; // 4.5MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 4.5MB.' }, { status: 400 });
    }

    // Upload to Vercel Blob
    const blob = await put(`menu/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
    });

    console.log('File uploaded to Vercel Blob:', blob.url);

    return NextResponse.json({ url: blob.url, success: true });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file', 
      details: error?.message || 'Unknown error',
      stack: process.env.NODE_ENV === 'development' ? error?.stack : undefined
    }, { status: 500 });
  }
}
