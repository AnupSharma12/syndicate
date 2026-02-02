'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, initiateEmailSignUp, setDocumentNonBlocking, createVerificationToken } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import Image from 'next/image';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Firebase not initialized',
            description: 'Please try again later.',
        });
        return;
    }
    
    setIsLoading(true);
    
    try {
      // Create user in Firebase Authentication
      const userCredential = await initiateEmailSignUp(auth, email, password);
      const user = userCredential.user;

      // Create user document in Firestore
      if (user && firestore) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userData = {
          id: user.uid,
          username: username || user.email?.split('@')[0] || 'new-user',
          email: user.email,
          staff: false,
          emailVerified: false,
        };
        setDocumentNonBlocking(userDocRef, userData, { merge: true });
      }

      // Create verification token
      if (user && firestore) {
        try {
          const token = await createVerificationToken(firestore, user.uid, email);

          // Send verification email
          const response = await fetch('/api/send-verification-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, token, userId: user.uid }),
          });

          if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to send verification email');
          }

          toast({
            title: 'Verification Email Sent!',
            description: 'Please check your email to verify your account. The link expires in 30 minutes.',
          });

          // Redirect to check email page
          localStorage.setItem('lastRegisteredEmail', email);
          router.push('/check-email?email=' + encodeURIComponent(email));
        } catch (emailError: any) {
          console.error('Error during email verification:', emailError);
          toast({
            title: 'Registration Successful!',
            description: 'Your account has been created. Please check your email to verify it.',
          });
          router.push('/check-email?email=' + encodeURIComponent(email));
        }
      }
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-background p-4 overflow-x-hidden">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Image src="/logo.jpg" alt="Syndicate ESP Logo" width={48} height={48} className="h-12 w-12 rounded-full" />
          </div>
          <CardTitle className="font-headline text-2xl">Register</CardTitle>
          <CardDescription>
            Create an account to get started.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                type="text"
                placeholder="yourusername"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{' '}
            <Link href="/login" className="underline">
              Sign In
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
