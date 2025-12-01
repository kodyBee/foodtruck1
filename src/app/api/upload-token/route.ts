import { NextResponse } from 'next/server';
import { handleUpload, type HandleUploadBody } from '@vercel/blob/client';

export const runtime = 'edge';

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as HandleUploadBody;
    
    console.log('Upload token request:', body);

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname, clientPayload) => {
        console.log('Generating token for:', pathname);
        
        // Validate file type from pathname
        const ext = pathname.split('.').pop()?.toLowerCase();
        const validExts = ['jpg', 'jpeg', 'png', 'webp', 'gif'];
        
        if (!ext || !validExts.includes(ext)) {
          console.error('Invalid file extension:', ext);
          throw new Error('Invalid file type');
        }

        return {
          allowedContentTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
          maximumSizeInBytes: 50 * 1024 * 1024, // 50MB
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        console.log('Upload completed:', blob.url);
      },
    });

    console.log('Token generated successfully');
    return NextResponse.json(jsonResponse);
  } catch (error: any) {
    console.error('Error in upload token route:', error);
    console.error('Error stack:', error.stack);
    return NextResponse.json(
      { error: error.message || 'Failed to generate upload token', details: error.stack },
      { status: 400 }
    );
  }
}
