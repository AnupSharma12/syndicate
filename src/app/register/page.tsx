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
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

export default function RegisterPage() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{ username?: string; email?: string; password?: string }>({});
  const auth = useAuth();
  const firestore = useFirestore();
  const router = useRouter();
  const { toast } = useToast();

  const getPasswordStrength = (pwd: string): { score: number; label: string; color: string } => {
    let score = 0;
    if (pwd.length >= 6) score++;
    if (pwd.length >= 10) score++;
    if (/[a-z]/.test(pwd) && /[A-Z]/.test(pwd)) score++;
    if (/\d/.test(pwd)) score++;
    if (/[^a-zA-Z\d]/.test(pwd)) score++;

    if (score <= 1) return { score: 20, label: 'Very Weak', color: 'bg-red-500' };
    if (score === 2) return { score: 40, label: 'Weak', color: 'bg-orange-500' };
    if (score === 3) return { score: 60, label: 'Fair', color: 'bg-yellow-500' };
    if (score === 4) return { score: 80, label: 'Good', color: 'bg-blue-500' };
    return { score: 100, label: 'Strong', color: 'bg-green-500' };
  };

  const passwordStrength = getPasswordStrength(password);

  const validateForm = () => {
    const newErrors: { username?: string; email?: string; password?: string } = {};
    if (!username) newErrors.username = 'Username is required';
    else if (username.length < 3) newErrors.username = 'Username must be at least 3 characters';
    if (!email) newErrors.email = 'Email is required';
    else if (!/^\S+@\S+\.\S+$/.test(email)) newErrors.email = 'Invalid email format';
    if (!password) newErrors.password = 'Password is required';
    else if (password.length < 6) newErrors.password = 'Password must be at least 6 characters';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
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
        };
        setDocumentNonBlocking(userDocRef, userData, { merge: true });
      }

      toast({
        title: 'Registration Successful!',
        description: 'You can now log in with your credentials.',
      });
      
      router.push('/login');
    } catch (error: any) {
      setErrors({ username: error.message, email: '', password: '' });
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
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-background to-background p-4 overflow-x-hidden">
      <div className="w-full max-w-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
        <Card className="border-0 shadow-lg">
          <CardHeader className="text-center bg-gradient-to-r from-blue-500/5 to-purple-500/5 pb-6">
            <div className="flex justify-center mb-4 transform transition-transform hover:scale-110">
              <Image src="/logo.jpg" alt="Syndicate ESP Logo" width={48} height={48} className="h-12 w-12 rounded-full shadow-md" />
            </div>
            <CardTitle className="font-headline text-2xl">Create Account</CardTitle>
            <CardDescription>
              Join Syndicate ESP today
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleRegister} className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="username" className="text-sm font-medium">Username</Label>
                  {username && username.length >= 3 ? (
                    <span className="text-xs text-green-500 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /></span>
                  ) : username ? (
                    <span className="text-xs text-red-500 flex items-center gap-1"><AlertCircle className="w-3 h-3" /></span>
                  ) : null}
                </div>
                <Input
                  id="username"
                  type="text"
                  placeholder="yourusername"
                  value={username}
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (errors.username) setErrors({ ...errors, username: undefined });
                  }}
                  disabled={isLoading}
                  className={`transition-all ${
                    errors.username ? 'border-red-500 focus-visible:ring-red-500' : ''
                  }`}
                />
                {errors.username && (
                  <p className="text-xs text-red-500 flex items-center gap-1 animate-in fade-in duration-200">
                    <AlertCircle className="w-3 h-3" />{errors.username}
                  </p>
                )}
              </div>
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
                  {password && (
                    <span className={`text-xs font-medium ${
                      passwordStrength.score >= 80 ? 'text-green-600' :
                      passwordStrength.score >= 60 ? 'text-blue-600' :
                      passwordStrength.score >= 40 ? 'text-yellow-600' : 'text-red-600'
                    }`}>
                      {passwordStrength.label}
                    </span>
                  )}
                </div>
                <div className="relative">
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a strong password"
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
                {password && (
                  <div className="space-y-1">
                    <Progress value={passwordStrength.score} className="h-2" />
                    <p className="text-xs text-gray-600 text-center">
                      {passwordStrength.score < 40 && 'Use uppercase, numbers, and symbols'}
                      {passwordStrength.score >= 40 && passwordStrength.score < 60 && 'Good start! Add more complexity'}
                      {passwordStrength.score >= 60 && passwordStrength.score < 80 && 'Getting strong!'}
                      {passwordStrength.score >= 80 && '✓ Strong password'}
                    </p>
                  </div>
                )}
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
                    Creating Account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>
            <div className="mt-6 text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium transition-colors">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
