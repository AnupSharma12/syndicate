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
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};
    if (!email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

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
    
    if (!validateForm()) return;
    
    if (!auth || !firestore) {
        toast({
            variant: 'destructive',
            title: 'Sign In Failed',
            description: 'Authentication service not available.',
        });
        return;
    }
    
    setIsLoading(true);
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
            
            // Use non-blocking set which handles errors via global emitter
            setDocumentNonBlocking(userDocRef, userData, { merge: true });

            // If the user is the designated admin, also create their staff role document
            if (isStaff) {
                const staffRoleRef = doc(firestore, 'roles_staff', user.uid);
                // Use non-blocking set here as well
                setDocumentNonBlocking(staffRoleRef, { email: user.email, username }, { merge: true });
            }
        }
      }

      toast({
        title: 'Signing In...',
        description: 'You will be redirected shortly.',
      });

      router.push('/');

    } catch (error: any) {
      setErrors({ email: error.message, password: '' });
      toast({
        variant: 'destructive',
        title: 'Sign In Failed',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-background p-4 overflow-x-hidden">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500/5 to-purple-500/5 pb-6">
            <div className="flex justify-center mb-4 transform transition-transform hover:scale-110">
              <Image src="/logo.jpg" alt="Syndicate ESP Logo" width={48} height={48} className="h-12 w-12 rounded-full shadow-md" />
            </div>
            <CardTitle className="font-headline text-2xl">Sign In</CardTitle>
            <CardDescription>
              Welcome back! Sign in to your account
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                  {email && !/^\S+@\S+\.\S+$/.test(email) ? (
                    <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /></span>
                  ) : email ? (
                    <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /></span>
                  ) : null}
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (errors.email) setErrors({ ...errors, email: undefined });
                  }}
                  disabled={isLoading}
                  className={`transition-all ${
                    errors.email ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                />
                {errors.email && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                    <AlertCircle className="w-3 h-3" />{errors.email}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                  <Link href="/forgot-password" passHref>
                    <span className="text-xs text-blue-600 hover:text-blue-700 cursor-pointer transition-colors">Forgot password?</span>
                  </Link>
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) setErrors({ ...errors, password: undefined });
                    }}
                    disabled={isLoading}
                    className="pr-10 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    disabled={isLoading}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-colors"
                  >
                    {showPassword ? (
                      <EyeOff className="w-4 h-4" />
                    ) : (
                      <Eye className="w-4 h-4" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                    <AlertCircle className="w-3 h-3" />{errors.password}
                  </p>
                )}
              </div>
              <Button 
                type="submit" 
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Don&apos;t have an account?{' '}
              <Link href="/register" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Create one
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
