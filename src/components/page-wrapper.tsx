'use client';

import { useState, useEffect } from 'react';
import { Loader } from '@/components/loader';

// This state should be managed globally to ensure it only runs once per session.
let isInitialLoad = true;

export function PageWrapper({ children }: { children: React.ReactNode }) {
  const [loading, setLoading] = useState(isInitialLoad);

  useEffect(() => {
    if (isInitialLoad) {
      const timer = setTimeout(() => {
        setLoading(false);
        isInitialLoad = false; // Set to false after the first load
      }, 1500); // Simulate a loading time of 1.5 seconds

      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <>
      {loading && <Loader />}
      <div
        className={`transition-opacity duration-700 ${
          loading ? 'opacity-0' : 'opacity-100'
        }`}
      >
        {children}
      </div>
    </>
  );
}
