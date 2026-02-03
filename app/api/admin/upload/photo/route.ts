import { requireAuth } from '@/lib/auth-utils';
import { ensureBucket, getStorageClient, upload } from '@/lib/storage';
import { NextRequest, NextResponse } from 'next/server';

const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    if (!getStorageClient()) {
      return NextResponse.json(
        { error: 'Storage (MinIO) is not configured' },
        { status: 503 },
      );
    }

    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || !(file instanceof File)) {
      return NextResponse.json(
        { error: 'No file or invalid file' },
        { status: 400 },
      );
    }

    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `File too large (max ${MAX_SIZE_MB}MB)` },
        { status: 400 },
      );
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: 'Invalid file type. Allowed: JPEG, PNG, WebP, GIF' },
        { status: 400 },
      );
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const safeName = `${Date.now()}-${Math.random().toString(36).slice(2, 9)}.${ext}`;

    const ok = await ensureBucket();
    if (!ok) {
      return NextResponse.json(
        { error: 'Storage bucket unavailable' },
        { status: 503 },
      );
    }

    const bytes = await file.arrayBuffer();
    const result = await upload(safeName, bytes, file.type);

    if (!result) {
      return NextResponse.json({ error: 'Upload failed' }, { status: 500 });
    }

    return NextResponse.json({ url: result.url });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
