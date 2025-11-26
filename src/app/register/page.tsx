'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, initiateEmailSignUp, setDocumentNonBlocking } from '@/firebase';
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

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // This is a non-blocking call
      initiateEmailSignUp(auth, email, password);

      // We can't get user immediately, so we listen for auth state changes
      // and create the user document there. For now, just show a toast.
      // A more robust solution would use a listener that triggers after signup.
      // The user object creation will happen via onAuthStateChanged side-effect
      // for newly created users. We will create a placeholder for now.
      auth.onAuthStateChanged(user => {
        if(user) {
           const userDocRef = doc(firestore, 'users', user.uid);
           const userData = {
            id: user.uid,
            username,
            email,
            staff: false // Default to not staff
          };
          setDocumentNonBlocking(userDocRef, userData, { merge: true });
        }
      })

      toast({
        title: 'Registration Successful!',
        description: 'Please sign in with your new account.',
      });
      router.push('/login');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
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
              Create Account
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
