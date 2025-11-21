import { NextResponse } from 'next/server';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  // Location is now automatically determined from events and weekly schedule
  const location = await dataStore.getCurrentLocation();
  return NextResponse.json(location);
}
