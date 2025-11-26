'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useDoc, useMemoFirebase } from '@/firebase';
import { doc, getFirestore } from 'firebase/firestore';
import { Loader } from '@/components/loader';

export function AdminRouteGuard({ children }: { children: React.ReactNode }) {
  const { user, isUserLoading } = useUser();
  const router = useRouter();
  const firestore = getFirestore();

  const userRoleRef = useMemoFirebase(
    () => (user ? doc(firestore, 'roles_staff', user.uid) : null),
    [user, firestore]
  );

  const { data: staffRole, isLoading: isRoleLoading } = useDoc(userRoleRef);

  const isChecking = isUserLoading || isRoleLoading;
  
  // Directly grant access if the user is the primary admin.
  const isPrimaryAdmin = user?.email === 'anup34343@gmail.com';

  useEffect(() => {
    if (!isChecking) {
      if (!user) {
        // Not logged in, redirect to login
        router.replace('/login');
      } else if (!staffRole && !isPrimaryAdmin) {
        // Logged in but not a staff member, redirect to home
        router.replace('/');
      }
    }
  }, [user, staffRole, isChecking, router, isPrimaryAdmin]);

  if (isChecking) {
    return <Loader />;
  }

  if (user && (staffRole || isPrimaryAdmin)) {
    return <>{children}</>;
  }

  // Fallback, though useEffect should handle redirection.
  return <Loader />;
}
