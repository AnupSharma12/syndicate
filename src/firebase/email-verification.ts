'use client';

import { Auth, sendEmailVerification, User } from 'firebase/auth';

/**
 * Send a verification email to the user
 * @param user - The Firebase user to send verification email to
 */
export async function sendVerificationEmail(user: User): Promise<void> {
  try {
    await sendEmailVerification(user, {
      url: `${process.env.NEXT_PUBLIC_APP_URL}/login?emailVerified=true`,
      handleCodeInApp: true,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

/**
 * Check if user email is verified
 * @param user - The Firebase user to check
 * @returns true if email is verified
 */
export function isEmailVerified(user: User): boolean {
  return user.emailVerified;
}

/**
 * Reload user to get updated email verification status
 * @param user - The Firebase user to reload
 */
export async function reloadUser(user: User): Promise<void> {
  await user.reload();
}
