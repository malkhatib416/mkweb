import { requireAuth } from '@/lib/auth-utils';
import { CLIENT_PHOTOS_BUCKET, supabaseAdmin } from '@/lib/supabase';
import { NextRequest, NextResponse } from 'next/server';

const BLOG_COVERS_PREFIX = 'blog-covers';
const MAX_SIZE_MB = 5;
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Supabase is not configured' },
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
    const storagePath = `${BLOG_COVERS_PREFIX}/${safeName}`;

    const bytes = await file.arrayBuffer();
    const { data: uploadData, error } = await supabaseAdmin.storage
      .from(CLIENT_PHOTOS_BUCKET)
      .upload(storagePath, bytes, {
        contentType: file.type,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return NextResponse.json(
        { error: error.message || 'Upload failed' },
        { status: 500 },
      );
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(CLIENT_PHOTOS_BUCKET)
      .getPublicUrl(uploadData.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch (error) {
    console.error('Blog cover upload error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Upload failed' },
      { status: 500 },
    );
  }
}
