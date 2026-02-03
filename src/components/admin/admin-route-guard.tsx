'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase, useFirestore, ADMIN_EMAIL } from '@/firebase';
import { doc } from 'firebase/firestore';
import { Loader } from '@/components/loader';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = useFirestore();

  const userDocRef = useMemoFirebase(
    () => (user && firestore ? doc(firestore, 'users', user.uid) : null),
    [user, firestore]
  );

  const { data: userDoc, isLoading: isRoleLoading } = useDoc(userDocRef);

  const isChecking = isUserLoading || isRoleLoading;
  
  const isStaff = userDoc?.staff === true || user?.email === ADMIN_EMAIL;

  useEffect(() => {
    if (!isChecking) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (!isStaff) {
        // Logged in but not a staff member, redirect to home
        router.replace('/');
      }
    }
  }, [user, isStaff, isChecking, router]);

  if (isChecking) {
    return <Loader />;
  }

  if (user && isStaff) {
    return <>{children}</>;
  }

  // Fallback, though useEffect should handle redirection.
  return <Loader />;
}
