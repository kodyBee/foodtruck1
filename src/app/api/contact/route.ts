import type { NextRequest } from 'next/server';
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest) {
  console.log('Contact form API called');
  
  try {
    const body = await request.json();
    console.log('Received body:', { ...body, message: body.message?.substring(0, 50) });
    
    const { name, email, phone, eventDate, message } = body;

    // Basic Server-side Validation
    if (!name || !email || !message) {
      console.log('Validation failed - missing required fields');
      return NextResponse.json(
        { error: 'Name, email, and message are required.' },
        { status: 400 }
      );
    }

    // Check if email is configured
    const hasEmailConfig = !!process.env.GMAIL_USER && !!process.env.GMAIL_APP_PASSWORD;
    console.log('Environment check:', { hasEmailConfig });
    
    if (!hasEmailConfig) {
      console.log('Email service not configured - logging only');
      console.log('----- NEW CONTACT FORM SUBMISSION (Email not sent) -----');
      console.log('From:', name, email);
      console.log('Phone:', phone || 'Not provided');
      console.log('Event Date:', eventDate || 'Not provided');
      console.log('Message:', message);
      console.log('---------------------------------------');
      
      // Still return success so the form doesn't error for the user
      return NextResponse.json({ success: true, emailSent: false });
    }

    console.log('Configuring email transporter...');
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_APP_PASSWORD,
      },
    });

    console.log('Sending email...');
    // Send email
    await transporter.sendMail({
      from: `"Crown Majestic Kitchen" <${process.env.GMAIL_USER}>`,
      to: process.env.GMAIL_USER, // Send to yourself
      replyTo: email,
      subject: `New Contact Form Submission from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #eab308; border-bottom: 2px solid #eab308; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          
          <div style="margin: 20px 0;">
            <p style="margin: 10px 0;"><strong>Name:</strong> ${name}</p>
            <p style="margin: 10px 0;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
            <p style="margin: 10px 0;"><strong>Phone:</strong> ${phone || 'Not provided'}</p>
            <p style="margin: 10px 0;"><strong>Event Date:</strong> ${eventDate || 'Not provided'}</p>
          </div>
          
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0;"><strong>Message:</strong></p>
            <p style="margin: 10px 0; white-space: pre-wrap;">${message}</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #ddd; margin: 20px 0;">
          
          <p style="color: #666; font-size: 12px;">
            This email was sent from the Crown Majestic Kitchen contact form.<br>
            Reply directly to this email to respond to ${name}.
          </p>
        </div>
      `,
    });

    console.log('Email sent successfully!');
    return NextResponse.json({ success: true, emailSent: true });
    
  } catch (error) {
    console.error('Contact form fatal error:', error);
    console.error('Error details:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    return NextResponse.json(
      { error: 'Failed to send message.' },
      { status: 500 }
    );
  }
}