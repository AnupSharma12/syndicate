'use client';

import { useState, useEffect } from 'react';
import { errorEmitter } from '@/firebase/error-emitter';
import { FirestorePermissionError } from '@/firebase/errors';

/**
 * An invisible component that listens for globally emitted 'permission-error' events.
 * It logs errors instead of throwing to prevent the entire app from crashing.
 * Components can still access errors via their own state management.
 */
export function FirebaseErrorListener() {
  // Use the specific error type for the state for type safety.
  const [error, setError] = useState<FirestorePermissionError | null>(null);

  useEffect(() => {
    // The callback now expects a strongly-typed error, matching the event payload.
    const handleError = (error: FirestorePermissionError) => {
      // Log the error for debugging purposes
      console.error('Firestore Permission Error:', error);
      
      // Set error in state but don't throw - this allows the app to continue functioning
      // while the component that triggered the error can handle it in its own error state
      setError(error);
    };

    // The typed emitter will enforce that the callback for 'permission-error'
    // matches the expected payload type (FirestorePermissionError).
    errorEmitter.on('permission-error', handleError);

    // Unsubscribe on unmount to prevent memory leaks.
    return () => {
      errorEmitter.off('permission-error', handleError);
    };
  }, []);

  // Instead of throwing, just log. Each component using useCollection/useDoc
  // has its own error state to handle display.
  if (error) {
    console.warn('Firestore error occurred but app will continue:', error);
  }

  // This component renders nothing.
  return null;
}
