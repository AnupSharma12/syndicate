'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Mail, ArrowRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth, useFirestore, createVerificationToken } from '@/firebase';

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { toast } = useToast();
  const auth = useAuth();
  const firestore = useFirestore();
  const email = searchParams.get('email') || 'your email';
  const [isResending, setIsResending] = useState(false);
  const [resendCount, setResendCount] = useState(0);
  const [cooldown, setCooldown] = useState(0);

  const handleResendEmail = async () => {
    if (cooldown > 0) {
      toast({
        variant: 'destructive',
        title: 'Please wait',
        description: `You can resend the email in ${cooldown} seconds.`,
      });
      return;
    }

    if (resendCount >= 5) {
      toast({
        variant: 'destructive',
        title: 'Too many attempts',
        description: 'You have reached the maximum number of resend attempts. Please try again later.',
      });
      return;
    }

    setIsResending(true);

    try {
      if (!auth || !firestore) {
        throw new Error('Firebase not initialized');
      }

      const currentUser = auth.currentUser;
      if (!currentUser) {
        throw new Error('User not found. Please register again.');
      }

      // Create a new verification token
      const token = await createVerificationToken(firestore, currentUser.uid, email);

      // Send verification email
      const response = await fetch('/api/send-verification-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, userId: currentUser.uid }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to send verification email');
      }

      setResendCount(resendCount + 1);
      setCooldown(60);

      // Start countdown
      const interval = setInterval(() => {
        setCooldown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      toast({
        title: 'Email Sent!',
        description: 'Verification email has been resent. Please check your inbox.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Failed to Resend',
        description: error.message || 'Could not resend verification email.',
      });
    } finally {
      setIsResending(false);
    }
  };

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
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary/10 rounded-full">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="font-headline text-2xl">Verify Your Email</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-3">
            <p className="text-muted-foreground">
              We&apos;ve sent a verification link to:
            </p>
            <p className="font-semibold text-foreground break-all">
              {decodeURIComponent(email)}
            </p>
            <p className="text-sm text-muted-foreground">
              ⏱️ Click the link in the email to verify your account. The link will expire in 30 minutes.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm">Didn&apos;t receive the email?</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Try resending the verification email below</li>
            </ul>
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleResendEmail}
              disabled={isResending || cooldown > 0}
              className="w-full"
              variant="outline"
            >
              {isResending ? 'Sending...' : cooldown > 0 ? `Resend in ${cooldown}s` : 'Resend Email'}
            </Button>
            {resendCount > 0 && (
              <p className="text-xs text-muted-foreground text-center">
                Resent {resendCount} time{resendCount !== 1 ? 's' : ''}
              </p>
            )}
            <Button onClick={() => router.push('/login')} className="w-full">
              Go to Login
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            <Button
              onClick={() => router.push('/register')}
              variant="outline"
              className="w-full"
            >
              Back to Register
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            After verifying your email, you&apos;ll be able to log in to your account.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
