'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Image from 'next/image';
import { Mail, ArrowRight } from 'lucide-react';

export default function CheckEmailPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const email = searchParams.get('email') || 'your email';

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
              Click the link in the email to verify your account. The link will expire in 24 hours.
            </p>
          </div>

          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
            <p className="font-semibold text-sm">Didn&apos;t receive the email?</p>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Check your spam or junk folder</li>
              <li>Make sure you entered the correct email address</li>
              <li>Try registering again with a different email</li>
            </ul>
          </div>

          <div className="space-y-3">
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
