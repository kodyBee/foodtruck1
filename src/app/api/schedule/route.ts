import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { dataStore } from '@/lib/dataStore';

export async function GET() {
  const schedule = dataStore.getSchedule();
  return NextResponse.json(schedule);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const schedule = await request.json();

    if (!Array.isArray(schedule)) {
      return NextResponse.json(
        { error: 'Schedule must be an array' },
        { status: 400 }
      );
    }

    const updatedSchedule = dataStore.updateSchedule(schedule);
    return NextResponse.json(updatedSchedule);
  } catch (error) {
    return NextResponse.json(
      { error: 'Invalid request body' },
      { status: 400 }
    );
  }
}
