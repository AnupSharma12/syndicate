'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth, useFirestore, initiateEmailSignIn, setDocumentNonBlocking, useAppSettings } from '@/firebase';
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
import { GlowCard, TextGradient, PopIn, FadeInBlur } from '@/components/animated-components';

export default function LoginPage() {
  const { settings } = useAppSettings();
  const appName = settings.appName || 'Syndicate ESP';
  const appLogoUrl = settings.logoUrl || '/logo.jpg';
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
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-background p-4 overflow-x-hidden relative">
      {/* Animated background gradient */}
      <div className="absolute inset-0 opacity-30 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/20 rounded-full filter blur-3xl animate-pulse" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full filter blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      <FadeInBlur>
        <PopIn delay="0.1s">
          <div className="w-full max-w-sm relative z-10">
            <Card className="border-0 shadow-2xl backdrop-blur-sm bg-background/95 hover:shadow-blue-500/20 transition-shadow duration-500">
              <CardHeader className="text-center bg-gradient-to-r from-red-500/10 to-blue-500/10 pb-6 relative overflow-hidden">
                {/* Animated shimmer effect */}
                <div className="absolute inset-0 shimmer opacity-0 hover:opacity-50 transition-opacity duration-300" />
                
                <div className="flex justify-center mb-4 transform transition-transform hover:scale-110 relative z-10">
                  <div className="p-3 rounded-full bg-gradient-to-br from-red-500/20 to-blue-500/20 border border-red-500/30 hover:border-blue-500/50 transition-colors duration-300">
                    <Image src={appLogoUrl} alt={`${appName} Logo`} width={48} height={48} className="h-12 w-12 rounded-full shadow-md" />
                  </div>
                </div>
                <CardTitle className="font-headline text-2xl relative z-10">
                  <TextGradient>Sign In</TextGradient>
                </CardTitle>
                <CardDescription className="relative z-10">
                  Welcome back to {appName}! Sign in to your account
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6 relative z-10">
                <form onSubmit={handleSignIn} className="space-y-4">
                  <PopIn delay="0.2s">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="email" className="text-sm font-medium">Email</Label>
                        {email && !/^\S+@\S+\.\S+$/.test(email) ? (
                          <span className="text-xs text-red-500 flex items-center gap-1 animate-pulse"><AlertCircle className="w-3 h-3" /></span>
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
                          errors.email ? 'border-red-500 focus-visible:ring-red-500 shake' : ''
                        }`}
                      />
                      {errors.email && (
                        <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                          <AlertCircle className="w-3 h-3" />{errors.email}
                        </p>
                      )}
                    </div>
                  </PopIn>

                  <PopIn delay="0.3s">
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="password" className="text-sm font-medium">Password</Label>
                        <Link href="/forgot-password" passHref>
                          <span className="text-xs text-red-600 hover:text-red-700 cursor-pointer transition-colors hover:underline-animate">Forgot password?</span>
                        </Link>
                      </div>
                      <div className="relative group">
                        <Input
                          id="password"
                          type={showPassword ? 'text' : 'password'}
                          value={password}
                          onChange={(e) => {
                            setPassword(e.target.value);
                            if (errors.password) setErrors({ ...errors, password: undefined });
                          }}
                          disabled={isLoading}
                          className="pr-10 transition-all group-focus-within:ring-2 group-focus-within:ring-blue-500/50"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          disabled={isLoading}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 disabled:opacity-50 transition-all duration-200 hover:scale-110"
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
                  </PopIn>

                  <PopIn delay="0.4s">
                    <Button 
                      type="submit" 
                      className="w-full bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-red-500/50 relative overflow-hidden group"
                      disabled={isLoading}
                    >
                      <div className="absolute inset-0 shimmer opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Signing In...
                        </>
                      ) : (
                        'Sign In'
                      )}
                    </Button>
                  </PopIn>
                </form>
                <div className="mt-6 text-center text-sm text-gray-600">
                  Don&apos;t have an account?{' '}
                  <Link href="/register" className="text-red-600 hover:text-red-700 font-medium transition-colors relative group">
                    Create one
                    <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-red-600 to-blue-600 group-hover:w-full transition-all duration-300" />
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </PopIn>
      </FadeInBlur>
    </div>
  );
}
