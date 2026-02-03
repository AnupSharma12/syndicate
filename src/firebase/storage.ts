'use client';

import type { FirebaseApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export async function uploadFileToStorage(
  firebaseApp: FirebaseApp,
  file: File,
  pathPrefix: string
): Promise<string> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
  const filePath = `${pathPrefix}/${Date.now()}-${safeName}`;
  const storage = getStorage(firebaseApp);
  const storageRef = ref(storage, filePath);

  await uploadBytes(storageRef, file, { contentType: file.type || 'application/octet-stream' });
  return getDownloadURL(storageRef);
}
