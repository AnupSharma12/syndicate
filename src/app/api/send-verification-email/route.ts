import { NextRequest, NextResponse } from 'next/server';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { firebaseConfig } from '@/firebase/config';

// Email service configuration - can be used with any email provider
const sendEmail = async (to: string, subject: string, html: string) => {
  // Option 1: Using a service like Resend (https://resend.com)
  if (process.env.RESEND_API_KEY) {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
        },
        body: JSON.stringify({
          from: process.env.EMAIL_FROM || 'noreply@syndicate-esp.com',
          to,
          subject,
          html,
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending with Resend:', error);
      return false;
    }
  }

  // Option 2: Using Mailgun (https://www.mailgun.com)
  if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
    try {
      const response = await fetch(
        `https://api.mailgun.net/v3/${process.env.MAILGUN_DOMAIN}/messages`,
        {
          method: 'POST',
          headers: {
            Authorization: `Basic ${Buffer.from(
              `api:${process.env.MAILGUN_API_KEY}`
            ).toString('base64')}`,
          },
          body: new URLSearchParams({
            from: process.env.EMAIL_FROM || 'Syndicate ESP <noreply@syndicate-esp.com>',
            to,
            subject,
            html,
          }).toString(),
        }
      );
      return response.ok;
    } catch (error) {
      console.error('Error sending with Mailgun:', error);
      return false;
    }
  }

  // Option 3: Using SendGrid (https://sendgrid.com)
  if (process.env.SENDGRID_API_KEY) {
    try {
      const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: to }] }],
          from: { email: process.env.EMAIL_FROM || 'noreply@syndicate-esp.com' },
          subject,
          content: [{ type: 'text/html', value: html }],
        }),
      });
      return response.ok;
    } catch (error) {
      console.error('Error sending with SendGrid:', error);
      return false;
    }
  }

  console.warn('No email service configured');
  return false;
};

export async function POST(request: NextRequest) {
  try {
    const { email, token, userId } = await request.json();

    if (!email || !token) {
      return NextResponse.json(
        { error: 'Missing email or token' },
        { status: 400 }
      );
    }

    // Create verification link
    const verificationLink = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${encodeURIComponent(
      token
    )}`;

    // Email HTML template
    const emailHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 5px; text-align: center; }
            .content { background: #f9f9f9; padding: 20px; margin: 20px 0; border-radius: 5px; }
            .button { background: #667eea; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block; margin: 20px 0; }
            .footer { text-align: center; color: #666; font-size: 12px; margin-top: 20px; }
            .warning { color: #e74c3c; font-size: 12px; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>Verify Your Email</h1>
            </div>
            <div class="content">
              <p>Hello,</p>
              <p>Thank you for registering with <strong>Syndicate ESP</strong>!</p>
              <p>Please verify your email address by clicking the button below:</p>
              <a href="${verificationLink}" class="button">Verify Email</a>
              <p>Or copy this link if the button doesn't work:</p>
              <p style="word-break: break-all; background: #fff; padding: 10px; border-radius: 3px;">
                <code>${verificationLink}</code>
              </p>
              <div class="warning">
                ⏱️ This link will expire in 30 minutes.
              </div>
            </div>
            <div class="footer">
              <p>If you didn't create this account, you can ignore this email.</p>
              <p>&copy; 2026 Syndicate ESP. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    // Send the email
    const emailSent = await sendEmail(email, 'Verify Your Syndicate ESP Email', emailHtml);

    if (!emailSent) {
      // Log to console in development
      if (process.env.NODE_ENV === 'development') {
        console.log('Email verification link (dev only):', verificationLink);
        return NextResponse.json({
          success: true,
          message: 'Email sent (development mode)',
          devLink: verificationLink,
        });
      }

      return NextResponse.json(
        { error: 'Failed to send verification email. Please try again.' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Verification email sent successfully',
    });
  } catch (error: any) {
    console.error('Error sending verification email:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to send verification email' },
      { status: 500 }
    );
  }
}
