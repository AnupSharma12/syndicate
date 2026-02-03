import { db } from './config';
import { collection, addDoc, query, where, orderBy, getDocs, Timestamp } from 'firebase/firestore';

export interface AuditLog {
  id: string;
  action: string;
  user: string;
  userId: string;
  details: string;
  status: 'success' | 'error' | 'warning';
  timestamp: Date;
}

/**
 * Log an action to the audit logs collection
 */
export async function logAction(
  action: string,
  userId: string,
  user: string,
  details: string,
  status: 'success' | 'error' | 'warning' = 'success'
): Promise<void> {
  try {
    const logsCollection = collection(db, 'auditLogs');
    await addDoc(logsCollection, {
      action,
      userId,
      user,
      details,
      status,
      timestamp: Timestamp.now(),
      createdAt: new Date().toISOString()
    });
  } catch (error) {
    console.error('Failed to log action:', error);
  }
}

/**
 * Fetch audit logs for a specific user
 */
export async function getAuditLogsByUser(userId: string): Promise<AuditLog[]> {
  try {
    const logsCollection = collection(db, 'auditLogs');
    const q = query(
      logsCollection,
      where('userId', '==', userId),
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      action: doc.data().action,
      user: doc.data().user,
      userId: doc.data().userId,
      details: doc.data().details,
      status: doc.data().status,
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Failed to fetch audit logs:', error);
    return [];
  }
}

/**
 * Fetch all audit logs (admin only)
 */
export async function getAllAuditLogs(limit = 100): Promise<AuditLog[]> {
  try {
    const logsCollection = collection(db, 'auditLogs');
    const q = query(
      logsCollection,
      orderBy('timestamp', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.slice(0, limit).map(doc => ({
      id: doc.id,
      action: doc.data().action,
      user: doc.data().user,
      userId: doc.data().userId,
      details: doc.data().details,
      status: doc.data().status,
      timestamp: doc.data().timestamp?.toDate() || new Date()
    }));
  } catch (error) {
    console.error('Failed to fetch all audit logs:', error);
    return [];
  }
}

/**
 * Delete old audit logs (older than specified days)
 */
export async function deleteOldLogs(days: number = 90): Promise<void> {
  try {
    const logsCollection = collection(db, 'auditLogs');
    const cutoffDate = new Timestamp(
      Math.floor(Date.now() / 1000) - days * 24 * 60 * 60,
      0
    );
    const q = query(
      logsCollection,
      where('timestamp', '<', cutoffDate)
    );
    const snapshot = await getDocs(q);
    
    for (const doc of snapshot.docs) {
      await doc.ref.delete();
    }
  } catch (error) {
    console.error('Failed to delete old logs:', error);
  }
}
