'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, initiateEmailSignIn, setDocumentNonBlocking } from '@/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
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
    if (!auth) return;
  
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
  
    return () => unsubscribe();
  }, [auth, router]);


  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: 'Authentication service not available.',
        });
        return;
    }
    try {
      const userCredential = await initiateEmailSignIn(auth, email, password);
      const user = userCredential.user;

      // After successful sign-in, check and set user/admin documents
      if (user) {
        const userDocRef = doc(firestore, 'users', user.uid);
        const userDoc = await getDoc(userDocRef);

        if (!userDoc.exists()) {
            const username = user.email?.split('@')[0] || 'new-user';
            const isStaff = user.email === 'anup34343@gmail.com';
            const userData = {
                id: user.uid,
                username,
                email: user.email,
                staff: isStaff,
            };
            
            // Use blocking setDoc here to ensure docs are created before redirect
            await setDoc(userDocRef, userData);

            if (isStaff) {
                const staffRoleRef = doc(firestore, 'roles_staff', user.uid);
                await setDoc(staffRoleRef, { email: user.email, username });
            }
        }
      }

      toast({
        title: 'Signing In...',
        description: 'You will be redirected shortly.',
      });

      router.push('/');

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
