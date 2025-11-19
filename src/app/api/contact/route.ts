import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, phone, eventDate, message } = body;

    // Basic Server-side Validation
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // TODO: Integrate Nodemailer or Resend here
    // For now, we log it so you can see it works in your terminal
    console.log('----- NEW CONTACT FORM SUBMISSION -----');
    console.log('From:', name, email);
    console.log('Date:', eventDate);
    console.log('Message:', message);
    console.log('---------------------------------------');

    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}