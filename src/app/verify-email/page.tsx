'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth, useFirestore, verifyToken, markTokenAsUsed } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const firestore = useFirestore();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const token = searchParams.get('token');

        if (!token) {
          throw new Error('No verification token provided');
        }

        if (!firestore) {
          throw new Error('Firebase not initialized');
        }

        // Verify the token
        const result = await verifyToken(firestore, token);

        if (!result.valid) {
          throw new Error(result.error || 'Invalid verification token');
        }

        const { userId, email } = result;

        // Mark token as used
        await markTokenAsUsed(firestore, token);

        // Update user document to mark email as verified
        const userDocRef = doc(firestore, 'users', userId!);
        await setDoc(
          userDocRef,
          {
            emailVerified: true,
            emailVerifiedAt: new Date(),
          },
          { merge: true }
        );

        setStatus('success');
        setMessage('Email verified successfully! Redirecting to login...');

        // Redirect to login after 2 seconds
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. The link may have expired.');
      }
    };

    verifyEmail();
  }, [searchParams, firestore, router]);

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 overflow-x-hidden">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <Image
              src="/logo.jpg"
              alt="Syndicate ESP Logo"
              width={48}
              height={48}
              className="h-12 w-12 rounded-full"
            />
          </div>
          <CardTitle className="font-headline text-2xl">
            {status === 'loading' && 'Verifying Email'}
            {status === 'success' && 'Email Verified'}
            {status === 'error' && 'Verification Failed'}
          </CardTitle>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <CardDescription>{message}</CardDescription>
          
          {status === 'loading' && (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          )}

          {status === 'success' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Your email has been verified successfully. You can now log in to your account.
              </p>
              <Button
                onClick={() => router.push('/login')}
                className="w-full"
              >
                Go to Login
              </Button>
            </div>
          )}

          {status === 'error' && (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                There was a problem verifying your email. The link may have expired or is invalid.
              </p>
              <div className="flex flex-col gap-2">
                <Button
                  onClick={() => {
                    // Get email from localStorage or use a fallback
                    const email = localStorage.getItem('lastRegisteredEmail');
                    if (email) {
                      router.push(`/check-email?email=${encodeURIComponent(email)}`);
                    } else {
                      router.push('/register');
                    }
                  }}
                  className="w-full"
                >
                  Request New Verification Email
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  variant="outline"
                  className="w-full"
                >
                  Back to Login
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
