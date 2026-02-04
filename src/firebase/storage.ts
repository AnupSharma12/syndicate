'use client';

/**
 * Hybrid upload strategy:
 * 1. Attempt to upload to the local Next.js API (which writes to /public/uploads).
 * 2. If it fails (common on read-only filesystems like Vercel), fall back to ImgBB.
 */
export async function uploadFileToStorage(
  _firebaseApp: any, // Kept for signature compatibility with existing calls
  file: File,
  _pathPrefix: string = 'uploads'
): Promise<string> {
  // Step 1: Try Local Upload
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch('/api/upload-logo', {
      method: 'POST',
      body: formData,
    });
    
    if (response.ok) {
      const result = await response.json();
      return result.url;
    }
    throw new Error('Local upload rejected by server');
  } catch (localError) {
    console.warn('Local upload failed, falling back to external image host:', localError);
    
    // Step 2: Fallback to ImgBB
    const imgbbKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;
    if (!imgbbKey || imgbbKey === 'your_imgbb_api_key_here' || !imgbbKey) {
      throw new Error('Local upload failed and no ImgBB API key found. Please add NEXT_PUBLIC_IMGBB_API_KEY to your .env');
    }

    const externalFormData = new FormData();
    externalFormData.append('image', file);
    const externalResponse = await fetch(`https://api.imgbb.com/1/upload?key=${imgbbKey}`, {
      method: 'POST',
      body: externalFormData,
    });

    if (!externalResponse.ok) {
      const errorData = await externalResponse.json().catch(() => ({}));
      throw new Error(errorData?.error?.message || 'External image host upload also failed.');
    }

    const externalResult = await externalResponse.json();
    return externalResult.data.url;
  }
}
