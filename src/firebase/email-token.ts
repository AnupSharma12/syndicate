'use client';

import { Firestore, collection, doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';
import crypto from 'crypto';

/**
 * Generate a random verification token
 */
export function generateVerificationToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Create and store a verification token in Firestore
 * Token expires in 30 minutes
 */
export async function createVerificationToken(
  firestore: Firestore,
  userId: string,
  email: string
): Promise<string> {
  const token = generateVerificationToken();
  const expiresAt = new Date();
  expiresAt.setMinutes(expiresAt.getMinutes() + 30); // Expires in 30 minutes

  const tokenRef = doc(firestore, 'emailVerificationTokens', token);
  
  await setDoc(tokenRef, {
    userId,
    email,
    createdAt: new Date(),
    expiresAt,
    used: false,
  });

  return token;
}

/**
 * Verify a token and check if it's valid and not expired
 */
export async function verifyToken(
  firestore: Firestore,
  token: string
): Promise<{ valid: boolean; userId?: string; email?: string; error?: string }> {
  try {
    const tokenRef = doc(firestore, 'emailVerificationTokens', token);
    const tokenSnap = await getDoc(tokenRef);

    if (!tokenSnap.exists()) {
      return { valid: false, error: 'Token not found' };
    }

    const tokenData = tokenSnap.data();
    
    if (tokenData.used) {
      return { valid: false, error: 'Token has already been used' };
    }

    const expiresAt = new Date(tokenData.expiresAt.seconds * 1000);
    if (new Date() > expiresAt) {
      return { valid: false, error: 'Token has expired. Please request a new verification email.' };
    }

    return {
      valid: true,
      userId: tokenData.userId,
      email: tokenData.email,
    };
  } catch (error: any) {
    return { valid: false, error: error.message };
  }
}

/**
 * Mark a token as used
 */
export async function markTokenAsUsed(
  firestore: Firestore,
  token: string
): Promise<void> {
  const tokenRef = doc(firestore, 'emailVerificationTokens', token);
  await setDoc(tokenRef, { used: true }, { merge: true });
}

/**
 * Delete a token
 */
export async function deleteVerificationToken(
  firestore: Firestore,
  token: string
): Promise<void> {
  const tokenRef = doc(firestore, 'emailVerificationTokens', token);
  await deleteDoc(tokenRef);
}
