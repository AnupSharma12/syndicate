'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/firebase';
import { applyActionCode, isSignInWithEmailLink } from 'firebase/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const auth = useAuth();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const oobCode = searchParams.get('oobCode');
        const mode = searchParams.get('mode');

        if (!auth) {
          throw new Error('Firebase not initialized');
        }

        if (mode === 'verifyEmail' && oobCode) {
          // Use Firebase's built-in email verification
          await applyActionCode(auth, oobCode);
          setStatus('success');
          setMessage('Email verified successfully! Redirecting to login...');
          
          // Redirect to login after 2 seconds
          setTimeout(() => {
            router.push('/login');
          }, 2000);
        } else if (isSignInWithEmailLink(auth, window.location.href)) {
          // Handle sign-in link
          const email = window.localStorage.getItem('emailForSignIn');
          if (!email) {
            throw new Error('Email not found. Please sign up again.');
          }

          // Note: This requires additional implementation for email link sign-in
          setMessage('Sign-in link verified! Please complete your registration.');
        } else {
          throw new Error('Invalid verification link');
        }
      } catch (error: any) {
        console.error('Verification error:', error);
        setStatus('error');
        setMessage(error.message || 'Failed to verify email. Please try again.');
      }
    };

    verifyEmail();
  }, [searchParams, auth, router]);

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
                There was a problem verifying your email. The link may have expired.
              </p>
              <div className="flex gap-2">
                <Button
                  onClick={() => router.push('/register')}
                  variant="outline"
                  className="flex-1"
                >
                  Sign Up Again
                </Button>
                <Button
                  onClick={() => router.push('/login')}
                  className="flex-1"
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
