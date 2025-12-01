import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { put } from '@vercel/blob';

// Route segment config
export const runtime = 'nodejs';
export const maxDuration = 60;

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

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB.' }, { status: 400 });
    }

    // Check if Blob token is set
    const blobToken = process.env.BLOB_READ_WRITE_TOKEN || process.env.menu_READ_WRITE_TOKEN;
    if (!blobToken) {
      console.error('Blob token not found in environment variables');
      return NextResponse.json({ 
        error: 'Vercel Blob storage not configured. Please add BLOB_READ_WRITE_TOKEN or menu_READ_WRITE_TOKEN to your environment variables.' 
      }, { status: 500 });
    }

    // Upload to Vercel Blob using stream
    const blob = await put(`menu/${file.name}`, file, {
      access: 'public',
      addRandomSuffix: true,
      token: blobToken,
    });

    console.log('File uploaded to Vercel Blob:', blob.url);

    return NextResponse.json({ url: blob.url, success: true });
  } catch (error: any) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ 
      error: 'Failed to upload file', 
      details: error?.message || 'Unknown error',
    }, { status: 500 });
  }
}
