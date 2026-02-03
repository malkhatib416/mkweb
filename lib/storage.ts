/**
 * MinIO / S3-compatible object storage.
 * Replaces Supabase Storage for client photos and blog cover images.
 */

import {
  CreateBucketCommand,
  HeadBucketCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';

const endpoint = process.env.MINIO_ENDPOINT;
const accessKey = process.env.MINIO_ACCESS_KEY;
const secretKey = process.env.MINIO_SECRET_KEY;
const bucket = process.env.MINIO_BUCKET ?? 'uploads';
const publicUrlBase =
  process.env.MINIO_PUBLIC_URL ?? process.env.MINIO_ENDPOINT;

const hasConfig = Boolean(endpoint && accessKey && secretKey);

function createClient(): S3Client | null {
  if (!hasConfig) return null;
  return new S3Client({
    endpoint,
    region: 'us-east-1',
    credentials: {
      accessKeyId: accessKey!,
      secretAccessKey: secretKey!,
    },
    forcePathStyle: true,
  });
}

let _client: S3Client | null | undefined = undefined;

export function getStorageClient(): S3Client | null {
  if (_client === undefined) {
    _client = createClient();
  }
  return _client;
}

export const STORAGE_BUCKET = bucket;

/** Ensure the bucket exists (create if not). Call before first upload. */
export async function ensureBucket(): Promise<boolean> {
  const client = getStorageClient();
  if (!client) return false;
  try {
    await client.send(new HeadBucketCommand({ Bucket: bucket }));
    return true;
  } catch {
    try {
      await client.send(new CreateBucketCommand({ Bucket: bucket }));
      return true;
    } catch (err) {
      console.error('MinIO ensureBucket error:', err);
      return false;
    }
  }
}

export type UploadResult = { key: string; url: string };

/**
 * Upload bytes to MinIO and return the object key and public URL.
 * Bucket must exist (use ensureBucket() on app init or first request).
 */
export async function upload(
  key: string,
  body: ArrayBuffer | Buffer | Uint8Array,
  contentType: string,
): Promise<UploadResult | null> {
  const client = getStorageClient();
  if (!client) return null;

  try {
    await client.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: body instanceof ArrayBuffer ? new Uint8Array(body) : body,
        ContentType: contentType,
      }),
    );
    const url = getPublicUrl(key);
    return { key, url };
  } catch (err) {
    console.error('MinIO upload error:', err);
    return null;
  }
}

/**
 * Build public URL for an object.
 * Set MINIO_PUBLIC_URL if MinIO is behind a proxy (e.g. https://storage.example.com).
 */
export function getPublicUrl(key: string): string {
  const base = (publicUrlBase ?? '').replace(/\/$/, '');
  return `${base}/${bucket}/${key}`;
}
