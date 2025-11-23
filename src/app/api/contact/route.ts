import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

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

    // Check if Resend is configured
    if (!process.env.RESEND_API_KEY || !process.env.CONTACT_EMAIL_TO) {
      console.error('Email service not configured. Missing RESEND_API_KEY or CONTACT_EMAIL_TO');
      console.log('----- NEW CONTACT FORM SUBMISSION (Email not sent) -----');
      console.log('From:', name, email);
      console.log('Phone:', phone || 'Not provided');
      console.log('Event Date:', eventDate || 'Not provided');
      console.log('Message:', message);
      console.log('---------------------------------------');
      
      // Still return success so the form doesn't error for the user
      return NextResponse.json({ success: true });
    }

    // Send email using Resend
    const { data, error } = await resend.emails.send({
      from: 'Crown Majestic Kitchen <onboarding@resend.dev>', // You'll need to verify your domain
      to: [process.env.CONTACT_EMAIL_TO],
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This email was sent from the Crown Majestic Kitchen contact form.
          </p>
        </div>
      `,
    });

    if (error) {
      console.error('Failed to send email:', error);
      return NextResponse.json(
        { error: 'Failed to send message.' },
        { status: 500 }
      );
    }

    console.log('Email sent successfully:', data?.id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Contact form error:', error);
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}