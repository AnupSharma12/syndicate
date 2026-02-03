import { NextResponse } from 'next/server';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file');

    if (!file || typeof file !== 'object' || !('arrayBuffer' in file)) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 });
    }

    const blob = file as Blob & { name?: string; type?: string };
    const bytes = await blob.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = blob.name || 'upload.png';
    const safeName = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}-${safeName}`;
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'logos');

    await mkdir(uploadDir, { recursive: true });
    await writeFile(path.join(uploadDir, filename), buffer);

    return NextResponse.json({ url: `/uploads/logos/${filename}` });
  } catch (error) {
    console.error('Logo upload failed:', error);
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
  }
}
