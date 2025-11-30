'use client';

import React, { type ReactNode, useState, useEffect } from 'react';
import { FirebaseProvider } from '@/firebase/provider';
import { initializeFirebase } from '@/firebase';
import type { FirebaseApp } from 'firebase/app';
import type { Auth } from 'firebase/auth';
import type { Firestore } from 'firebase/firestore';
import { Loader } from '@/components/loader';
import { Toaster } from '@/components/ui/toaster';

interface FirebaseClientProviderProps {
  children: ReactNode;
}

interface FirebaseServices {
  firebaseApp: FirebaseApp;
  auth: Auth;
  firestore: Firestore;
}

export function FirebaseClientProvider({ children }: FirebaseClientProviderProps) {
  const [services, setServices] = useState<FirebaseServices | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    const firebaseServices = initializeFirebase();
    setServices(firebaseServices);
  }, []);

  if (!isMounted) {
    // On the server, and on the very first client render, render nothing.
    // This guarantees that the server and client initial render match.
    return null;
  }

  if (!services) {
    // After mounting on the client, show a loader while Firebase initializes.
    return <Loader />;
  }

  return (
    <FirebaseProvider
      firebaseApp={services.firebaseApp}
      auth={services.auth}
      firestore={services.firestore}
    >
      {children}
      <Toaster />
    </FirebaseProvider>
  );
}
