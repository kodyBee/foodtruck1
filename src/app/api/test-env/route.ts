import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    hasAdminUsername: !!process.env.ADMIN_USERNAME,
    hasAdminPasswordHash: !!process.env.ADMIN_PASSWORD_HASH,
    hasNextAuthSecret: !!process.env.NEXTAUTH_SECRET,
    hasNextAuthUrl: !!process.env.NEXTAUTH_URL,
    nodeVersion: process.version,
  });
}
