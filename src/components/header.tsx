'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Menu, LogOut, Shield, Loader2 } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { useAuth, useUser, useDoc, useFirestore, useMemoFirebase } from '@/firebase';
import { doc } from 'firebase/firestore';
import Image from 'next/image';

export function Header() {
  const { user, isUserLoading } = useUser();
  const auth = useAuth();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );
  const { data: userDoc, isLoading: isRoleLoading } = useDoc(userDocRef);

  const navLinks = [
    { href: '#tournaments', label: 'Tournaments' },
    { href: '#schedule', label: 'Schedule' },
    { href: '#about', label: 'About' },
  ];

  const handleSignOut = () => {
    if (auth) {
      auth.signOut();
    }
  };
  
  const isCheckingAuth = isUserLoading || (user && isRoleLoading);

  const isStaff = userDoc?.staff || user?.email === 'anup34343@gmail.com';

  const renderAuthButtons = () => {
    if (isCheckingAuth) {
      return (
        <div className="flex items-center gap-2">
          <Loader2 className="h-5 w-5 animate-spin md:mr-2" />
          <span className="hidden md:inline">Checking...</span>
        </div>
      );
    }

    if (user) {
      return (
        <Button variant="ghost" onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Sign Out
        </Button>
      );
    }

    return (
      <Button asChild>
        <Link href="/login">Sign In / Register</Link>
      </Button>
    );
  };
  
  const renderMobileAuthButtons = () => {
    if (isCheckingAuth) {
      return <div className="h-10" />
    }
    if (user) {
      return (
        <Button variant="ghost" onClick={handleSignOut} className="mt-4 justify-start text-lg">
          <LogOut className="mr-2 h-5 w-5" />
          Sign Out
        </Button>
      );
    }
    return (
      <Button asChild className="mt-4 text-lg">
        <Link href="/login">Sign In / Register</Link>
      </Button>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 max-w-7xl items-center justify-between px-4">
        <div className="flex items-center gap-6">
          <Link href="/" className="flex items-center gap-2" aria-label="Homepage">
            <Image src="https://iili.io/fo18z3G.png" alt="Syndicate ESP Logo" width={32} height={32} className="h-8 w-8" />
            <span className="hidden font-headline text-xl font-bold sm:inline-block">
              Syndicate ESP
            </span>
          </Link>
          <nav className="hidden items-center gap-6 text-sm md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            {!isCheckingAuth && isStaff && (
              <Link
                href="/admin"
                className="flex items-center font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                <Shield className="mr-2 h-4 w-4" />
                Admin
              </Link>
            )}
          </nav>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center">
          {renderAuthButtons()}
        </div>

        {/* Mobile Menu */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <Menu className="h-5 w-5" />
                <span className="sr-only">Toggle Menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <div className="grid gap-4 py-6">
                  <Link href="/" className="flex items-center gap-2 mb-4" aria-label="Homepage">
                    <Image src="https://iili.io/fo18z3G.png" alt="Syndicate ESP Logo" width={32} height={32} className="h-8 w-8" />
                    <span className="font-headline text-xl font-bold">
                      Syndicate ESP
                    </span>
                  </Link>
                {navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                    {link.label}
                  </Link>
                ))}
                {!isCheckingAuth && isStaff && (
                  <Link
                    href="/admin"
                    className="flex w-full items-center py-2 text-lg font-semibold"
                  >
                      <Shield className="mr-2 h-5 w-5" />
                    Admin
                  </Link>
                )}
                {renderMobileAuthButtons()}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
