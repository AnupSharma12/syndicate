'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, initiateEmailSignIn, setDocumentNonBlocking } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
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
import { Logo } from '@/components/logo';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    if (!auth || !firestore) return;

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        
        // This is a simplified example. In a real app, you might want to check 
        // if the document exists before setting it to avoid overwriting data.
        // For this app's purpose, we ensure the user document exists on login.
        const username = user.email?.split('@')[0] || 'user';
        const isStaff = user.email === 'anup34343@gmail.com';

        const userData = {
          id: user.uid,
          username,
          email: user.email,
          staff: isStaff,
        };
        
        // Create user document if it doesn't exist
        setDocumentNonBlocking(userDocRef, userData, { merge: true });

        if (isStaff) {
          const staffRoleRef = doc(firestore, 'roles_staff', user.uid);
          setDocumentNonBlocking(staffRoleRef, { email: user.email, username }, { merge: true });
        }
        
        router.push('/');
      }
    });

    return () => unsubscribe();
  }, [auth, firestore, router]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) {
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: 'Authentication service not available.',
        });
        return;
    }
    try {
      initiateEmailSignIn(auth, email, password);
      toast({
        title: 'Signing In...',
        description: 'You will be redirected shortly.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <Card className="w-full max-w-sm">
        <CardHeader className="text-center">
           <div className="flex justify-center mb-4">
            <Logo className="h-12 w-12" />
          </div>
          <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
          <CardDescription>
            Enter your credentials to access your account.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignIn} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
              />
            </div>
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="underline">
              Register
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
